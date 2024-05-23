import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Game = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [damage, setDamage] = useState('');

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setGame(data);
            } catch (error) {
                console.error('Error fetching game:', error);
            }
        };

        fetchGame();

    }, [id]);

    const attackMonster = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(window.location.origin + `/livingstonesapp/games/${id}/attack/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ damage }),
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
            }));
        } catch (error) {
            console.error('Error attacking monster:', error);
        }
    };

    if (!game) return <div>Loading...</div>;

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
};

export default Game;
