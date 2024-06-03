import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './ActiveGames.css';
import Panel from "../Elements/Panel"
import Header from "../Header/Header";
import PaginatedPanel from "../Elements/PaginatedPanel";
import Footer from "../Elements/Footer";

const config = require('../../../settings');
const API_URL = config.API_URL;
const renderGameEntry = (game) => (
    <a href={`/game/${game.id}/join/`}>
        {game.name ? game.name : `Game ${game.id}`}
    </a>
)

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
        <div className={"active-games-container"}>
            <Header/>
            <div className={"active-games"}>
                <PaginatedPanel items={games} itemsPerPage={10} title={"Active Games"}
                                renderEntry={renderGameEntry}/>
                <Link to="/create-game">
                    <button className={"button-large"}>Create New Game</button>
                </Link>
            </div>
            <Footer/>
        </div>
    );
};

export default ActiveGames;
