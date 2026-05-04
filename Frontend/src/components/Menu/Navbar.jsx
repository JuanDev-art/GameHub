import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileModal from '../ProfileModal/ProfileModal';
import './Navbar.css'

function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
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
                
            <Link to="/ranking" className="navbar-ranking-link">
                🏆 RANKING
            </Link>

                {username && (
                    <div className="user-info">
                        <span className="player-badge">PRO PLAYER</span>
                        <span className="username"
                            onClick={() => setShowProfile(true)}
                            style={{ cursor: 'pointer' }}
                        >{username}</span>
                    <button onClick={handleLogout} className="exit-button">
                         <i className="exit-icon">⏻</i> Exit
                    </button>
        </div>
    )}
</div>  
        {/* Modal de perfil */}
        {showProfile && (
                <ProfileModal onClose={() => setShowProfile(false)} />
            )}
        </nav>
    );
}

export default Navbar;