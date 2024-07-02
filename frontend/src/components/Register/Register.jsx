import React, {useState} from 'react';
import './Register.css';
import Header from "../Header/Header";

const Register = ({onClose}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const response = await fetch('/livingstonesapp/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password, firstName, lastName, email})
        });

        const data = await response.json();
        if (data.error) {
            setError(data.error);
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className="register-container">
            <Header/>
            <div className={"register-modal-container"}>
                <div className={"register-modal"} onClick={onClose}>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className='modalContainer'
                    >
                        <h1>Register</h1>
                        {error && <p className="error">{error}</p>}
                        <form onSubmit={handleRegister} className="register-form">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="submit">Register</button>
                        </form>
                        <p>Already have an account? <a href="/login">Login here</a>.</p>

                    </div>
                </div>

            </div>

        </div>
    );
};
export default Register;
