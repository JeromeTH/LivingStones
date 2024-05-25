import React from 'react';
import './Game.css'; // Ensure this imports the CSS where the leaderboard styles are defined

const Leaderboard = ({ leaderboard }) => {
    return (
        <div className="leaderboard">
            <h3>Leaderboard</h3>
            <ul>
                {leaderboard.map((entry, index) => (
                    <li key={index}>
                        <span className="username">{entry.username}</span>
                        <span className="damage">{entry.total_damage}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
