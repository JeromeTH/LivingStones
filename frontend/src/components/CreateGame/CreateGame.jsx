// CreateGame.jsx
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const CreateGame = () => {
    const [monsterName, setMonsterName] = useState('');
    const [bloodLevel, setBloodLevel] = useState('');
    const navigate = useNavigate();
    const createGame = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(window.location.origin + '/livingstonesapp/create-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    monster: {
                        name: monsterName,
                        blood_level: bloodLevel,
                    },
                }),
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/game/${data.id}`);
            } else {
                const errorDetails = await response.json();
                console.error('Error creating game:', errorDetails.message);
            }
        } catch (error) {
            console.error('Error creating game:', error);
        }
    };

    return (
        <div>
            <h2>Create New Game</h2>
            <form onSubmit={createGame}>
                <div>
                    <label>
                        Monster Name:
                        <input
                            type="text"
                            value={monsterName}
                            onChange={(e) => setMonsterName(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Blood Level:
                        <input
                            type="number"
                            value={bloodLevel}
                            onChange={(e) => setBloodLevel(e.target.value)}
                        />
                    </label>
                </div>
                <button type="submit">Create Game</button>
            </form>
        </div>
    );
};

export default CreateGame;
