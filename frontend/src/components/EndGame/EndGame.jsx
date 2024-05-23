import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const EndGame = () => {
    const {id} = useParams(); // Get the game ID from the URL
    const [leaderboard, setLeaderboard] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchLeaderboard = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/leaderboard/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setLeaderboard(data.leaderboard);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };

        fetchLeaderboard();
    }, [id]);

    const endGame = async () => {
        try {
            await fetch(window.location.origin + `/livingstonesapp/game/${id}/endgame/`, {
                method: 'POST',
            });
            navigate(`/`);// Redirect to the home page after deleting the game
        } catch (error) {
            console.error('Error ending game:', error);
        }
    };

    return (
        <div>
            <h1>Game Over</h1>
            <h2>Leaderboard</h2>
            <ul>
                {leaderboard.map(([username, totalDamage], index) => (
                    <li key={index}>
                        {username}: {totalDamage}
                    </li>
                ))}
            </ul>
            <button onClick={endGame}>Leave</button>
        </div>
    );
};

export default EndGame;
