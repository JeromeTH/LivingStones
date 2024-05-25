import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Summary from "./Summary";
import "./Game.css";
import Leaderboard from "./Leaderboard";

const Game = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [damage, setDamage] = useState('');
    const [socket, setSocket] = useState(null);

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


                // Open WebSocket connection
                const ws = new WebSocket(`ws://${window.location.host}/ws/game/${id}/`);
                ws.onopen = () => {
                    console.log('WebSocket connection opened');
                };

                ws.onmessage = (e) => {
                    const message = JSON.parse(e.data);
                    setGame((prevGame) => ({
                        ...prevGame,
                        monster: {
                            ...prevGame.monster,
                            blood_level: message.blood_level,
                        },
                    }));
                    setLeaderboard(message.leaderboard);
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

    const attackMonster = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/attack/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({damage}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setGame((prevGame) => ({
                ...prevGame,
                monster: {
                    ...prevGame.monster,
                    blood_level: data.blood_level,
                },
                is_active: data.is_active,
            }));

            // Notify other clients via WebSocket
            if (socket) {
                socket.send(JSON.stringify({
                    blood_level: data.blood_level,
                    is_active: data.is_active,
                    leaderboard: data.leaderboard
                }));
            }


        } catch (error) {
            console.error('Error attacking monster:', error);
        }
    };


    if (!game) return <div>Loading...</div>;

    if (!game.is_active) {
        console.log("game is inactive");
        return (
            <Summary/>
        );
    } else {
        console.log("game is active");
        return (
            <div className="game-container">
                <div className="game-info">
                    <h2>Game ID: {game.id}</h2>
                    <h3>Monster: {game.monster.name}</h3>
                    <div className="blood-level-bar-container">
                        <div
                            className="blood-level-bar"
                            style={{width: `${game.monster.blood_level}%`}}
                        ></div>
                    </div>
                    <form onSubmit={attackMonster} className="attack-form">
                        <label>
                            Damage:
                            <input
                                type="number"
                                value={damage}
                                onChange={(e) => setDamage(e.target.value)}
                            />
                        </label>
                        <button type="submit">Attack</button>
                    </form>
                    <div>
                        <h4>Participants:</h4>
                        <ul>
                            {game.participants.map((participant, index) => (
                                <li key={index}>{participant}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <Leaderboard leaderboard={leaderboard}/>
            </div>
        );
    }


};

export default Game;

