// CreateGame.jsx
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Modal from "../Elements/Modal"
import Panel from "../Elements/Panel";
import "./CreateGame.css"
import Header from "../Header/Header";
import Footer from "../Elements/Footer";

const CreateGame = () => {
    const [npcName, setNPCName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [bloodLevel, setBloodLevel] = useState('');
    const navigate = useNavigate();
    const [gameName, setGameName] = useState('');

    const createGame = async (event) => {
        event.preventDefault();
        const token = sessionStorage.getItem('token'); // Retrieve the JWT token
        console.log(token)
        const response = await fetch(window.location.origin + '/livingstonesapp/create-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: gameName
            }),
        });

        if (response.ok) {
            const data = await response.json();
            navigate(`/game/${data.id}/join`);
        } else {
            const errorDetails = await response.json();
            console.error('Error in creating game:', errorDetails.message);
        }
        console.log('Game created');
        setShowModal(false);
    };

    return (
        <div className={"create-game-container"}>
            <Header/>
            <button className={"button-large"} onClick={() => setShowModal(true)}>創建遊戲室</button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={createGame}>
                    <div>
                        <label>
                            Game Name:
                            <input
                                type="text"
                                value={gameName}
                                onChange={(e) => setGameName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <button type="submit">創建</button>
                </form>
            </Modal>
            <Footer/>
        </div>
    );
};

export default CreateGame;
