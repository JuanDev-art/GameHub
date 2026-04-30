import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className='landing-wrapper'>

            <div className='stars'></div>
            <div className='twinkling'></div>

            <div className='landing-content'>
                <div className='logo-section'>

                    <h1 className='hero-logo'>GameHub</h1>
                    <div className="logo-underline"></div>

                </div>

                <p className='hero-subtitle'>THE ULTIMATE 2D GAMING PLATFORM</p>

                <div className='action-zone'>
                    <button className='press-start-btn' 
                    onClick={() => navigate('/login')}
                    aria-label="Ir a la página de inicio de sesión" >
                        PRESS START
                    </button>
                    <p className="scroll-hint">INSERT COIN TO PLAY</p>

                </div>

            </div>

            <div className="corner-decoration top-left"></div>
            <div className="corner-decoration bottom-right"></div>

        </div>
    );
};

export default LandingPage;