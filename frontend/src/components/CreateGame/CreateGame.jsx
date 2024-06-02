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

    const [npcList, setNPCList] = useState([]);
    const [selectedNPC, setSelectedNPC] = useState(null);

    useEffect(() => {
        const fetchNPCs = async () => {
            const response = await fetch(window.location.origin + '/livingstonesapp/npcs');
            const data = await response.json();
            setNPCList(data);
            console.log(data);
        };
        fetchNPCs();
    }, []);


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
                npc_id: selectedNPC,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            navigate(`/game/${data.id}/join`);
        } else {
            const errorDetails = await response.json();
            console.error('Error in creating game:', errorDetails.message);
        }
        console.log('Game created:', {npcName, bloodLevel});
        setShowModal(false);

    };

    return (
        <div className={"create-game-container"}>
            <Header/>
            <button className={"button-large"} onClick={() => setShowModal(true)}>Create Game</button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={createGame}>
                    <div>
                        <label>
                            Select NPC:
                            <select
                                value={selectedNPC}
                                onChange={(e) => setSelectedNPC(e.target.value)}
                            >
                                <option value="">Select an NPC</option>
                                {npcList.map((npc) => (
                                    <option key={npc.id} value={npc.id}>
                                        {npc.name} (Blood Level: {npc.current_blood})
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button type="submit">Create Game</button>
                </form>
            </Modal>
            <Footer/>
        </div>
    );
};

export default CreateGame;
