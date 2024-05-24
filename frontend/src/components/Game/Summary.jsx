import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";


const Summary = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            const token = localStorage.getItem('token');
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
        <div>
            <h2>Summary</h2>
            <ul>
                {summary.leaderboard.map(([username, totalDamage], index) => (
                    <li key={index}>
                        {username}: {totalDamage}
                    </li>
                ))}
            </ul>
            <h2>Participants</h2>
            <ul>
                {summary.participants.map((participant, index) => (
                    <li key={index}>{participant}</li>
                ))}
            </ul>
            <button onClick={() => navigate(`/`)}>Go to Home</button>
        </div>
    );
}

export default Summary;