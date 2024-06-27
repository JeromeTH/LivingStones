import React from 'react';
import Header from '../Header/Header'; // Adjust the path if necessary
import './Home.css';
import Footer from "../Elements/Footer"; // Assuming you have a CSS file for styling

const Home = () => {
    return (
        <div className="home-container">
            <Header/>
            <main>
                <h1>You Are Living Stones</h1>
                <h2>台北真理堂2024國中營</h2>
                <h2>隆重鉅獻</h2>
            </main>
            <Footer/>
        </div>
    );
};

export default Home;

