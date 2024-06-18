import React, {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import "./Game.css";
import Footer from "../Elements/Footer";
import PaginatedPanel from "components/Elements/PaginatedPanel";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
                    setGame(prevGame => ({
                        ...prevGame,
                        ...message
                    }));
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
                <button onClick={() => setIsAttackMode(!isAttackMode)}>
                    {isAttackMode ? "Show Game Progress" : "Attack NPC"}
                </button>
                {isAttackMode ? (
                    <div className={"attack-form-container"}>
                        <form onSubmit={attack} className="attack-form">
                            <label>
                                Damage:
                                <input
                                    type="number"
                                    value={damage}
                                    onChange={(e) => setDamage(e.target.value)}
                                />
                            </label>
                            <button type="submit">Attack</button>
                            {message && <div className="message">{message}</div>}
                        </form>
                        <div className="opponents-selection">
                            <h3>Select Opponents to Attack</h3>
                            {game && game.players.map(player => (
                                <div key={player.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={player.id}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedTargets([...selectedTargets, player.id]);
                                                } else {
                                                    setSelectedTargets(selectedTargets.filter(id => id !== player.id));
                                                }
                                            }}
                                        />
                                        {player.name} (Blood: {player.current_blood})
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={"game-info"}>
                        <PaginatedPanel
                            items={bloodLeaderboard}
                            title="Blood Leaderboard"
                            itemsPerPage={10}
                            renderEntry={(player) => (
                                <>
                                    {player.name} - {player.current_blood}
                                </>
                            )}
                        />
                        <PaginatedPanel
                            items={damageLeaderboard}
                            title="Damage Leaderboard"
                            itemsPerPage={10}
                            renderEntry={(player) => (
                                <>
                                    {player.name} - {player.total_damage}
                                </>
                            )}
                        />
                        <a className={"home-button"} href={'/'}>Home</a>
                    </div>
                )
                }
                <Footer/>
            </div>
        )
            ;
    }
};

export default Game;

