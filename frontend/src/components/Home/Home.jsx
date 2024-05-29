import React from 'react';
import Header from '../Header/Header'; // Adjust the path if necessary
import './Home.css';
import Footer from "../Elements/Footer"; // Assuming you have a CSS file for styling

const Home = () => {
    return (
        <div className="home-container">
            <Header/>
            <main>
                <h2>Welcome to Living Stones</h2>
                <p>Login to start fighting npcs and track your progress.</p>
            </main>
            <Footer/>
        </div>
    );
};

export default Home;

