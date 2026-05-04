import { useEffect, useState } from 'react';
import './ProfileModal.css';

function ProfileModal({ onClose }) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`http://localhost:8080/api/matches/best/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setScores(data);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    const gameEmojis = {
        'Fruit Basket': '🍎',
        'Crocodile Run': '🐊'
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={e => e.stopPropagation()}>

                {/* Cabecera */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        {username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="profile-username">{username}</h2>
                        <span className="profile-badge">PRO PLAYER</span>
                    </div>
                    <button className="profile-close" onClick={onClose}>✕</button>
                </div>

                {/* Mejores puntuaciones */}
                <div className="profile-scores">
                    <h3 className="profile-scores-title">🏆 Mejores puntuaciones</h3>

                    {loading ? (
                        <p className="profile-loading">Cargando...</p>
                    ) : scores.length === 0 ? (
                        <p className="profile-empty">Aún no has jugado ninguna partida</p>
                    ) : (
                        scores.map((match, index) => (
                            <div key={index} className="profile-score-row">
                                <span className="profile-game-name">
                                    {gameEmojis[match.gameName] || '🎮'} {match.gameName}
                                </span>
                                <span className="profile-score-value">
                                    {match.score} pts
                                </span>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}

export default ProfileModal;