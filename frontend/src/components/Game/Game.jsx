import React, {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import "./Game.css";
import Footer from "../Elements/Footer";
import PaginatedPanel from "components/Elements/PaginatedPanel";
import Panel from "components/Elements/Panel";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const generateColor = (index) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A5', '#A533FF', '#33FFF0']; // Add more colors as needed
    return colors[index % colors.length];
};
const calculateWidthPercentage = (value, maxValue) => {
    return (value / maxValue) * 100;
};

const Game = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [damage, setDamage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isAttackMode, setIsAttackMode] = useState(true);
    const attackSound = useRef(new Audio(`${process.env.PUBLIC_URL}/media/sound_effects/345441__artmasterrich__punch_01.wav`));
    const attackedSound = useRef(new Audio(`${process.env.PUBLIC_URL}/media/sound_effects/135855__joelaudio__grunt_001.wav`));
    const [message, setMessage] = useState('');
    const [selectedTargets, setSelectedTargets] = useState([]);
    const [starredPlayer, setStarredPlayer] = useState(null);


    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setGame(data);
                setLeaderboard(data.leaderboard);
                console.log(data);
                console.log(process.env.PUBLIC_URL);

                // Open WebSocket connection
                const ws = new WebSocket(`ws://${window.location.host}/ws/game/${id}/`);
                ws.onopen = () => {
                    console.log('WebSocket connection opened');
                };

                ws.onmessage = (e) => {
                    const message = JSON.parse(e.data);
                    setGame(prevGame => {
                        const updatedGame = {
                            ...prevGame,
                            ...message
                        };
                        console.log("Updated Game:", updatedGame);
                        return updatedGame;
                    });
                    setLeaderboard(message.leaderboard);
                    attackedSound.current.play();
                };
                setSocket(ws);

            } catch (error) {
                console.error('Error fetching game:', error);
            }
        };

        fetchGame();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [id]);

    const attack = async (event) => {
        event.preventDefault();
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/attack/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({damage, targets: selectedTargets}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Notify other clients via WebSocket
            if (socket) {
                await attackSound.current.play();
                await delay(400); // Wait for 0.5 seconds
                socket.send(JSON.stringify({}));  // Include the action
                setMessage('Attack sent!');
                // Hide the message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error attacking npc:', error);
        }
    };

    const handleStarPlayer = (player) => {
        setStarredPlayer(player);
    };

    if (!game) return <div>Loading...</div>;
    if (!game.is_active) {
        console.log("game is inactive");
        navigate(`/game/${id}/summary/`);
    } else {
        const bloodLeaderboard = [...game.players].sort((a, b) => b.current_blood - a.current_blood);
        const damageLeaderboard = [...game.players].sort((a, b) => b.total_damage - a.total_damage);
        console.log("game is active");
        return (
            <div className="game-container">
                {isAttackMode ? (
                    <div className={"attack-form-container"}>
                        <button className={'button-large'} onClick={() => setIsAttackMode(!isAttackMode)}>
                            {isAttackMode ? "排行榜畫面" : "攻擊畫面"}
                        </button>
                        <form onSubmit={attack} className="attack-form">
                            <label>
                                攻擊量:
                                <input
                                    type="number"
                                    value={damage}
                                    onChange={(e) => setDamage(e.target.value)}
                                />
                            </label>
                            <button type="submit">Attack</button>
                            {message && <div className="message">{message}</div>}
                        </form>
                        <Panel
                            items={game.players}
                            title="勾選想攻擊之對手"
                            renderEntry={(player) => (
                                <div key={player.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={player.id}
                                            checked={selectedTargets.includes(player.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedTargets(prevTargets => [...new Set([...prevTargets, player.id])]);
                                                } else {
                                                    setSelectedTargets(prevTargets => prevTargets.filter(id => id !== player.id));
                                                }
                                            }}
                                        />
                                        {player.name} (Blood: {player.current_blood})
                                    </label>
                                </div>
                            )}
                        />
                    </div>
                ) : (
                    <div className={"game-info"}>
                        <button className={'button-large'} onClick={() => setIsAttackMode(!isAttackMode)}>
                            {isAttackMode ? "排行榜畫面" : "攻擊畫面"}
                        </button>
                        {starredPlayer && (
                            <div className="starred-player">
                                <img src={starredPlayer.profile.image} alt="Starred Player"/>
                                <div
                                    className="starred-color-bar"
                                >
                                    <div
                                    style={{
                                        width: `${starredPlayer.current_blood*100/starredPlayer.profile.total_blood}%`,
                                        backgroundColor: 'red',
                                        height: '100%',
                                    }}>
                                    </div>
                                    {starredPlayer.current_blood}
                                </div>
                                <div style={{color: 'white'}}>
                                    剩餘血量：{starredPlayer.current_blood} / {starredPlayer.profile.total_blood}
                                </div>

                            </div>
                        )}

                        <div className={"leaderboard-container"}>
                            <Panel
                                items={bloodLeaderboard}
                                title="剩餘血量"
                                renderEntry={(player) => (
                                    <div className={"leaderboard-item"} onClick={() => handleStarPlayer(player)}>
                                        <img src={player.profile.image} alt={"Player"}></img>
                                        <div
                                            className="color-bar"
                                            style={{
                                                width: `${calculateWidthPercentage(player.current_blood, Math.max(...game.players.map(p => p.current_blood)))}%`,
                                                backgroundColor: generateColor(player.id)
                                            }}
                                        />
                                        <span style={{textAlign: 'right'}}>{player.current_blood}</span>
                                    </div>

                                )}
                            />
                            <Panel
                                items={damageLeaderboard}
                                title="攻擊量"
                                renderEntry={(player) => (
                                    <div className={"leaderboard-item"}>
                                        <img src={player.profile.image} alt={"Player"}></img>
                                        {/*<>*/}
                                        {/*    {player.name} - {player.total_damage}*/}
                                        {/*</>*/}
                                        <div
                                            className="color-bar"
                                            style={{
                                                width: `${calculateWidthPercentage(player.total_damage, Math.max(...game.players.map(p => p.total_damage)))}%`,
                                                backgroundColor: generateColor(player.id)
                                            }}
                                        />
                                        <span style={{textAlign: 'right'}}>{player.total_damage}</span>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                )
                }
            </div>
        )
            ;
    }
};

export default Game;

