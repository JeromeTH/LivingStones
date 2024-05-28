import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Panel from "../Elements/Panel";
import PaginatedPanel from "../Elements/PaginatedPanel";
import "./EndedGames.css"

const Archive = () => {
    const [endedGames, setEndedGames] = useState([]);
    useEffect(() => {
        const fetchEndedGames = async () => {
            try {
                const response = await fetch(window.location.origin + '/livingstonesapp/ended-games/');
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
        <div className={"ended-games"}>
            {/*<Panel>*/}
            {/*    <h1>Ended Games</h1>*/}
            {/*    <ul>*/}
            {/*        {endedGames.map((game) => (*/}
            {/*            <li key={game.id}>*/}
            {/*                <a href={`/game/${game.id}/`}>*/}
            {/*                    {game.name ? game.name : `Game ${game.id}`}*/}
            {/*                </a>*/}
            {/*            </li>*/}
            {/*        ))}*/}
            {/*    </ul>*/}
            {/*</Panel>*/}
            <PaginatedPanel items={endedGames} itemName={"Game"} href={"/game"} title="Ended Games"/>
        </div>
    );
};

export default Archive;
