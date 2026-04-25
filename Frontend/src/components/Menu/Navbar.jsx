import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'

function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => navigate('/')}>
                <div className="logo-container">
                    <span className="logo-icon">🎮</span>
                    <h1 className="logo-text">GameHub</h1>
                </div>
                <p className="logo-subtitle">2D Gaming Platform</p>
            </div>
            
            <div className="navbar-user-zone">
                {username && (
                    <div className="user-info">
                        <span className="player-badge">PRO PLAYER</span>
                        <span className="username">{username}</span>
                    <button onClick={handleLogout} className="exit-button">
                         <i className="exit-icon">⏻</i> Exit
                    </button>
        </div>
    )}
</div>
        </nav>
    );
}

export default Navbar;