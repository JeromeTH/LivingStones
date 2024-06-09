import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Summary from "./Summary";
import "./Game.css";
import Leaderboard from "./Leaderboard";
import Footer from "../Elements/Footer";

const Game = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [damage, setDamage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isAttackMode, setIsAttackMode] = useState(true);


    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setGame(data);
                setLeaderboard(data.leaderboard);
                console.log(data);

                // Open WebSocket connection
                const ws = new WebSocket(`ws://${window.location.host}/ws/game/${id}/`);
                ws.onopen = () => {
                    console.log('WebSocket connection opened');
                };


                ws.onmessage = (e) => {
                    const message = JSON.parse(e.data);
                    setGame((prevGame) => ({
                        ...prevGame,
                        npc: {
                            ...prevGame.npc,
                            current_blood: message.current_blood,
                        },
                    }));
                    setLeaderboard(message.leaderboard);
                };
                setSocket(ws);

            } catch (error) {
                console.error('Error fetching game:', error);
            }
        };

        fetchGame();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [id]);

    const attackNPC = async (event) => {
        event.preventDefault();
        const token = sessionStorage.getItem('token');

        try {
            const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/attack/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({damage}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setGame((prevGame) => ({
                ...prevGame,
                npc: {
                    ...prevGame.npc,
                    current_blood: data.current_blood,
                },
                is_active: data.is_active,
                leaderboard: data.leaderboard
            }));

            // Notify other clients via WebSocket
            if (socket) {
                socket.send(JSON.stringify({
                    current_blood: data.current_blood,
                    is_active: data.is_active,
                    leaderboard: data.leaderboard
                }));
            }


        } catch (error) {
            console.error('Error attacking npc:', error);
        }
    };


    if (!game) return <div>Loading...</div>;
    if (!game.is_active) {
        console.log("game is inactive");
        navigate(`/game/${id}/summary/`);
    } else {
        console.log("game is active");
        console.log(game.npc.attr.image);
        return (
            <div className="game-container">
                <button onClick={() => setIsAttackMode(!isAttackMode)}>
                    {isAttackMode ? "Show Game Progress" : "Attack NPC"}
                </button>
                {isAttackMode ? (
                    <form onSubmit={attackNPC} className="attack-form">
                        <label>
                            Damage:
                            <input
                                type="number"
                                value={damage}
                                onChange={(e) => setDamage(e.target.value)}
                            />
                        </label>
                        <button type="submit">Attack</button>
                    </form>
                ) : (
                    <div className={"game-info"}>
                        <h2>Game ID: {game.id}</h2>
                        <h3>NPC: {game.npc.attr.name}</h3>
                        <img src={game.npc.attr.image} alt="{{ game.npc.attr.name }}" className="npc-image"/>
                        <div className="blood-level-bar-container">
                            <h2>Blood Level: {game.npc.current_blood}</h2>
                            <div
                                className="blood-level-bar"
                                style={{width: `${game.npc.current_blood * 100 / game.npc.attr.total_blood}%`}}
                            ></div>
                        </div>
                        <Leaderboard leaderboard={leaderboard}/>
                    </div>
                )
                }
                <Footer/>
            </div>

        )
            ;
    }
};

export default Game;

