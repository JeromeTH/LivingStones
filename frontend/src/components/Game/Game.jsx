import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Summary from "./Summary";

const Game = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
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
            <div>
                <h2>Game ID: {game.id}</h2>
                <h3>Monster: {game.monster.name}</h3>
                <p>Blood Level: {game.monster.blood_level}</p>
                <form onSubmit={attackMonster}>
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
        );
    }


};

export default Game;

