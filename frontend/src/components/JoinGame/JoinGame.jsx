import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JoinGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch game information');
                }
                const data = await response.json();
                setGame(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchGame();
    }, [id]);

    const joinGame = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/join/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to join the game');
            }

            navigate(`/game/${id}`);
        } catch (error) {
            setError(error.message);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!game) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Join Game</h1>
            <p>Game ID: {game.id}</p>
            <p>Game Name: {game.name}</p>
            <p>Creator: {game.creator.username}</p>
            <button onClick={joinGame}>Join Game</button>
        </div>
    );
};

export default JoinGame;
