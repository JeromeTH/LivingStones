import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import "./JoinGame.css"
import Header from "../Header/Header";
import Footer from "../Elements/Footer";

const JoinGame = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [error, setError] = useState(null);
    const [isBoss, setIsBoss] = useState(false);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch game information');
                }
                const data = await response.json();
                setGame(data);
                console.log(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchGame();
    }, [id]);

    const joinGame = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(window.location.origin + `/livingstonesapp/game/${id}/join/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_boss: isBoss })
            });

            if (!response.ok) {
                throw new Error('Failed to join the game');
            }

            navigate(`/game/${id}`);
        } catch (error) {
            setError(error.message);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!game) {
        return <div>Loading...</div>;
    }

    return (
        <div className={"join-game-container"}>
            <Header/>
            <div className={"join-game"}>
                <p>Game ID: {game.id}</p>
                <p>Game Name: {game.name}</p>
                <p>Creator: {game.creator.username}</p>
                <p>
                    <input
                        type="checkbox"
                        checked={isBoss}
                        onChange={(e) => setIsBoss(e.target.checked)}
                    />
                    Are you the Boss?
                </p>
                <button className={"button-large"} onClick={joinGame}>Join Game</button>
            </div>
            <Footer/>
        </div>
    );
};

export default JoinGame;
