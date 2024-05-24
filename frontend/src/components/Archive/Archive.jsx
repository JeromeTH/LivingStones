import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Archive = () => {
    const [endedGames, setEndedGames] = useState([]);

    useEffect(() => {
        const fetchEndedGames = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(window.location.origin + `/livingstonesapp/ended-games/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setEndedGames(data);
            } catch (error) {
                console.error('Error fetching ended games:', error);
            }
        };

        fetchEndedGames();
    }, []);

    if (endedGames.length === 0) {
        return <div>No ended games found</div>;
    }

    return (
        <div>
            <h1>Archived Games</h1>
            <ul>
                {endedGames.map((game) => (
                    <li key={game.id}>
                        <Link to={`/game/${game.id}/`}>
                            {game.name ? game.name : `Game ${game.id}`}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Archive;
