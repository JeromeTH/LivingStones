import React, {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import "./Game.css";
import Footer from "../Elements/Footer";
import PaginatedPanel from "components/Elements/PaginatedPanel";
import Panel from "components/Elements/Panel";
import Countdown from "components/Elements/Countdown";

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
    const [damage, setDamage] = useState('');
    const [healing, setHealing] = useState('');
    const [shielding, setShielding] = useState('');
    const [socket, setSocket] = useState(null);
    const [isAttackMode, setIsAttackMode] = useState(true);
    const attackSound = useRef(new Audio(`${process.env.PUBLIC_URL}/media/sound_effects/345441__artmasterrich__punch_01.wav`));
    const attackedSound = useRef(new Audio(`${process.env.PUBLIC_URL}/media/sound_effects/135855__joelaudio__grunt_001.wav`));
    const [message, setMessage] = useState('');
    const [selectedTargets, setSelectedTargets] = useState([]);
    const [starredPlayerIndex, setStarredPlayerIndex] = useState(0);
    const [players, setPlayers] = useState([]);
    const [current_profile, setCurrentProfile] = useState({
        total_blood: 100,
        attack_power: 10,
        image: null
    });
    const [showCountdown, setShowCountdown] = useState(false);
    const [isBossTurn, setIsBossTurn] = useState(false);


    useEffect(() => {
        const fetchGame = async () => {
            const token = sessionStorage.getItem('token');
            try {
                const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setGame(data);
                setPlayers(data.players);
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
                    setPlayers(message.players);
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

    useEffect(() => {
        const fetchProfile = async () => {
            const token = sessionStorage.getItem('token');
            const response = await fetch(window.location.origin + '/livingstonesapp/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);
            setCurrentProfile(data);
        };
        fetchProfile();
    }, []);


    const starredPlayer = players[starredPlayerIndex];
    const handleNextPlayer = () => {
        setStarredPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    };

    const handlePreviousPlayer = () => {
        setStarredPlayerIndex((prevIndex) => (prevIndex - 1 + players.length) % players.length);
    };


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

    const heal = async (event) => {
        event.preventDefault();
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/heal/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({healing}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Notify other clients via WebSocket
            if (socket) {
                socket.send(JSON.stringify({}));  // Include the action
                setMessage('Healed!');
                // Hide the message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error Healing:', error);
        }
    };

    const shield = async (event) => {
        event.preventDefault();
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/shield/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({shielding}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Notify other clients via WebSocket
            if (socket) {
                socket.send(JSON.stringify({}));  // Include the action
                setMessage('added Shield!');
                // Hide the message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error Shielding:', error);
        }
    };

    const defend = async (newDefendMode) => {
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(`${window.location.origin}/livingstonesapp/game/${id}/defend/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({defendMode: newDefendMode}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (socket) {
                socket.send(JSON.stringify({}));  // Include the action
            }
        } catch (error) {
            console.error('Error defending:', error);
        }
    };
    const handleWinChange = () => {
        defend(true).catch(error => console.error('Error in handleWinChange:', error)); // Handle potential errors
    };

    const handleLoseChange = () => {
        defend(false).catch(error => console.error('Error in handleLoseChange:', error)); // Handle potential errors
    };

    if (!game) return <div>Loading...</div>;
    if (!game.is_active) {
        console.log("game is inactive");
        navigate(`/game/${id}/summary/`);
    } else {
        const bloodLeaderboard = [...game.players]
            .filter(player => !player.boss_mode)
            .sort((a, b) => b.current_blood - a.current_blood);

        const damageLeaderboard = [...game.players]
            .filter(player => !player.boss_mode)
            .sort((a, b) => b.total_damage - a.total_damage);

        const current_player = game.players.filter(player => player.profile.id === game.current_user_id)[0];
        console.log("game is active");
        return (
            <div className="game-container">
                {isAttackMode ? (
                    <div className={"attack-form-container"}>
                        <button className={'button-large'} onClick={() => setIsAttackMode(!isAttackMode)}>
                            {isAttackMode ? "排行榜畫面" : "攻擊畫面"}
                        </button>
                        <img src={current_profile.image} alt={"Me"}></img>
                        <h2>{current_profile.name}</h2>
                        <div>
                            <label>
                                贏：
                                <input
                                    type="checkbox"
                                    checked={current_player.defend_mode}
                                    onChange={handleWinChange}
                                />
                            </label>
                            <label>
                                輸：
                                <input
                                    type="checkbox"
                                    checked={!current_player.defend_mode}
                                    onChange={handleLoseChange}
                                />
                            </label>
                        </div>
                        <p>{current_player.defend_mode ? '猜拳：贏' : '猜拳：輸'}</p>

                        <form onSubmit={attack} className="attack-form">
                            <label>
                                攻擊量:
                                <input
                                    type="number"
                                    value={damage}
                                    onChange={(e) => setDamage(e.target.value)}
                                />
                            </label>
                            <button type="submit">執行</button>
                            {message && <div className="message">{message}</div>}
                        </form>
                        <form onSubmit={heal} className="attack-form">
                            <label>
                                回血量:
                                <input
                                    type="number"
                                    value={healing}
                                    onChange={(e) => setHealing(e.target.value)}
                                />
                            </label>
                            <button type="submit">執行</button>
                        </form>
                        <form onSubmit={shield} className="attack-form">
                            <label>
                                增加防禦力:
                                <input
                                    type="number"
                                    value={shielding}
                                    onChange={(e) => setShielding(e.target.value)}
                                />
                            </label>
                            <button type="submit">執行</button>
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
                                        {player.name} ({player.defend_mode ? "贏" : "輸"}, 血量: {player.current_blood} 防禦力：{player.shield})
                                    </label>
                                </div>
                            )}
                        />
                    </div>
                ) : (
                    <div className={"game-info-container"}>

                        <Panel
                            items={bloodLeaderboard}
                            title="剩餘血量"
                            renderEntry={(player) => (
                                <div className={"leaderboard-item"}
                                     onClick={() => setStarredPlayerIndex(players.indexOf(player))}>
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
                        <div className={`game-info ${isBossTurn ? 'dark-red' : 'dark-green'}`}>
                            <button className={'button-large'} onClick={() => setIsAttackMode(!isAttackMode)}>
                                {isAttackMode ? "排行榜畫面" : "攻擊畫面"}
                            </button>
                            {starredPlayer && (
                                <div className="starred-player">
                                    <img src={starredPlayer.profile.image} alt="Starred Player"/>
                                    <div
                                        className="starred-color-bar"
                                    >
                                        <div className={"starred-color-bar-blood"} style={{
                                            width: `${starredPlayer.current_blood * 100 / starredPlayer.profile.total_blood}%`
                                        }}>
                                        </div>
                                    </div>
                                    <div style={{color: 'white'}}>
                                        <h2>剩餘血量：{starredPlayer.current_blood} / {starredPlayer.profile.total_blood}</h2>
                                    </div>
                                    <div className={"button-container"}>
                                        <button onClick={handlePreviousPlayer}>
                                            <svg width="24" height="24" viewBox="0 0 24 24">
                                                <polygon points="15,3 3,12 15,21" fill="white"/>
                                            </svg>
                                        </button>
                                        <h2>{starredPlayer.name}</h2>
                                        <button onClick={handleNextPlayer}>
                                            <svg width="24" height="24" viewBox="0 0 24 24">
                                                <polygon points="9,3 21,12 9,21" fill="white"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className={"button-container"}>
                                <button className={'button-large'} onClick={() => setShowCountdown(true)}>
                                    倒數
                                </button>
                                {showCountdown && <Countdown onComplete={() => setShowCountdown(false)}/>}
                                <button className={'button-large'} onClick={() => setIsBossTurn(!isBossTurn)}>
                                    回合轉換
                                </button>
                            </div>
                        </div>

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
                )
                }
            </div>
        )
            ;
    }
};

export default Game;

