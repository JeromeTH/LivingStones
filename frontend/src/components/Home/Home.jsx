import React from 'react';
import Header from '../Header/Header'; // Adjust the path if necessary
import './Home.css'; // Assuming you have a CSS file for styling

const Home = () => {
    return (
        <div className="home-container">
            <Header/>
            <main>
                <h2>Welcome to Living Stones</h2>
                <p>Login to start fighting monsters and track your progress.</p>
            </main>
            <footer>
                <p>&copy; 2024 Monster Fighting App</p>
            </footer>
        </div>
    );
};

export default Home;

