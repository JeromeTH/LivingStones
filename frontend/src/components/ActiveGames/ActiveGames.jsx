import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './ActiveGames.css';
import Panel from "../Elements/Panel"
const ActiveGames = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(window.location.origin + '/livingstonesapp/active-games/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGames(data);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        fetchGames();
    }, []);

    return (
        <div>
            <Panel>
                <h2>Active Games</h2>
                <Link to="/create-game">
                    <button>Create New Game</button>
                </Link>
                <ul>
                    {games.map((game) => (
                        <li key={game.id}>
                            <a href={`/game/${game.id}/join/`}> Game Number {game.id} </a>
                        </li>
                    ))}
                </ul>
            </Panel>
        </div>
    );
};

export default ActiveGames;
