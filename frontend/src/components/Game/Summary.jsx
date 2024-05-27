import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import "./Summary.css"

const Summary = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            const token = sessionStorage.getItem('token');
            try {
                const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/summary/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                console.log('Fetched summary data:', data);  // Debugging: log fetched data
                setSummary(data);
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        };
        fetchSummary();
    }, [id]);

    if (!summary) return <div>Loading...</div>;

    console.log("summary object: ", summary);

    return (
        <div className="summary-container">
            <h2>Summary</h2>
            <ul className="leaderboard">
                <h3>Leaderboard</h3>
                {summary.leaderboard.map((item, index) => {
                    return (
                        <li key={index}>
                            {item.username}: {item.total_damage}
                        </li>
                    );
                })}
            </ul>
            <ul className="participants">
                <h2>Participants</h2>
                {summary.participants.map((participant, index) => (
                    <li key={index}>{participant}</li>
                ))}
            </ul>
            <button onClick={() => navigate(`/`)}>Go to Home</button>
        </div>
    );
}

export default Summary;