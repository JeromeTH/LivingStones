import React from 'react';
import './Game.css'; // Ensure this imports the CSS where the leaderboard styles are defined
import "./Leaderboard.css"
import PaginatedPanel from "../Elements/PaginatedPanel";

const renderLeaderboardEntry = (entry) => (
    <div>
        <span className="username">{entry.username}</span>
        <span className="separator">: </span>
        <span className="damage">{entry.total_damage}</span>
    </div>
)
const Leaderboard = ({leaderboard}) => {
    return (
        <div className="leaderboard">
            <PaginatedPanel items={leaderboard} renderEntry={renderLeaderboardEntry} title={"Leaderboard"}
                            itemsPerPage={10}/>
        </div>
    );
};

export default Leaderboard;
