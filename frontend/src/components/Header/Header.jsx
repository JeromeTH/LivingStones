import React from 'react';
import "./Header.css";

const Header = () => {
    const logout = async (e) => {
        e.preventDefault();
        let logout_url = window.location.origin + "/livingstonesapp/logout";
        const res = await fetch(logout_url, {
            method: "GET",
        });

        if (res.ok) {
            let username = sessionStorage.getItem('username');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('token'); // Remove the JWT token

            window.location.href = window.location.origin;
            window.location.reload();
            alert("Logging out " + username + "...");
        } else {
            alert("The user could not be logged out.");
        }
    };

    // Default home page items
    let home_page_items = <div></div>;

    // Gets the username in the current session
    let curr_user = sessionStorage.getItem('username');

    // If the user is logged in, show the username and logout option on home page
    if (curr_user !== null && curr_user !== "") {
        home_page_items = (
            <div className="input_panel">
                <span className='username'>{sessionStorage.getItem("username")}</span>
                <a className="nav_item" href="/livingstonesapp/logout" onClick={logout}>Logout</a>
            </div>
        );
    } else {
        home_page_items = (
            <div className="input_panel">
                <a className="nav_item" href="/login">Login</a>
                <a className="nav_item" href="/register">Register</a>
            </div>
        );
    }

    return (
        <header className="navbar">
            <div className="container">
                <h1>Living Stones</h1>
                <nav>
                    <a className="homepage_links" href="/">首頁</a>
                    <a className="homepage_links" href="/create-game">創建遊戲室</a>
                    <a className="homepage_links" href="/active-games">進行中</a>
                    <a className="homepage_links" href="/ended-games">已結束</a>
                    <a className="homepage_links" href="/profile">活石檔案</a>
                    {home_page_items}
                </nav>
            </div>
        </header>
    );
}

export default Header;
