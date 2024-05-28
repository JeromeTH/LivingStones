import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Panel from "../Elements/Panel";
import PaginatedPanel from "../Elements/PaginatedPanel";
import "./EndedGames.css"
import Header from "../Header/Header";

const renderGameEntry = (game) => (
    <a href={`/game/${game.id}/`}>
        {game.name ? game.name : `Game ${game.id}`}
    </a>
)

const Archive = () => {
    const [endedGames, setEndedGames] = useState([]);
    // const endedGames=[
    //             { id: 1, name: 'Game 1' },
    //             { id: 2, name: 'Game 2' },
    //             { id: 3, name: 'Game 3' },
    //             { id: 4, name: 'Game 4' },
    //             { id: 5, name: 'Game 5' },
    //             { id: 6, name: 'Game 6' },
    //             { id: 7, name: 'Game 7' },
    //             { id: 8, name: 'Game 8' },
    //             { id: 9, name: 'Game 9' },
    //             { id: 10, name: 'Game 10' },
    //             { id: 11, name: 'Game 11' },
    //             { id: 12, name: 'Game 12' },
    //             { id: 13, name: 'Game 13' },
    //             { id: 14, name: 'Game 14' },
    //             { id: 15, name: 'Game 15' },
    //             { id: 16, name: 'Game 16' },
    //             { id: 17, name: 'Game 17' },
    //             { id: 18, name: 'Game 18' },
    //             { id: 19, name: 'Game 19' },
    //             { id: 20, name: 'Game 20' },
    //         ];
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
        <div className={"ended-games-container"}>
            <Header/>
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
                <PaginatedPanel items={endedGames} itemsPerPage={10} title={"Ended Games"}
                                renderEntry={renderGameEntry}/>
            </div>
            <footer>
                <p>&copy; 2024 Monster Fighting App</p>
            </footer>
        </div>

    );
};

export default Archive;
