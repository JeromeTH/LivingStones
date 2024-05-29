import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import "./Summary.css"
import "./Leaderboard.css"
import Leaderboard from "./Leaderboard";
import Header from "../Header/Header";
import Footer from "../Elements/Footer";

const Summary = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    //const [summary, setSummary] = useState(null);

    const summary = {
        leaderboard: [
            {username: 'Player1', total_damage: 250},
            {username: 'Player2', total_damage: 200},
            {username: 'Player3', total_damage: 150},
            {username: 'Player4', total_damage: 100},
            {username: 'Player5', total_damage: 50},
        ],
        participants: [
            'Participant1',
            'Participant2',
            'Participant3',
            'Participant4',
            'Participant5',
        ],
    }
    // useEffect(() => {
    //     const fetchSummary = async () => {
    //         const token = sessionStorage.getItem('token');
    //         try {
    //             const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/summary/`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`,
    //                 },
    //             });
    //             const data = await response.json();
    //             console.log('Fetched summary data:', data);  // Debugging: log fetched data
    //             setSummary(data);
    //         } catch (error) {
    //             console.error('Error fetching summary:', error);
    //         }
    //     };
    //     fetchSummary();
    // }, [id]);
    //
    // if (!summary) return <div>Loading...</div>;
    //
    // console.log("summary object: ", summary);
    console.log(summary.leaderboard);
    return (
        <div className="summary-container">
            <Header/>
            <div className={"summary"}>
                <Leaderboard leaderboard={summary.leaderboard}/>
                {/*<ul className="participants">*/}
                {/*    <h2>Participants</h2>*/}
                {/*    {summary.participants.map((participant, index) => (*/}
                {/*        <li key={index}>{participant}</li>*/}
                {/*    ))}*/}
                {/*</ul>*/}
                <button className={"button-large"} onClick={() => navigate(`/`)}>Go to Home</button>
            </div>
            <Footer/>
        </div>
    );
}

export default Summary;