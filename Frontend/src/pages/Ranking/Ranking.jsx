import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ranking.css';

function Ranking() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('1');
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    const games = [
        { id: '1', name: 'Fruit Basket', emoji: '🍎' },
        { id: '2', name: 'Crocodile Run', emoji: '🐊' }
    ];

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/api/matches/top/${tab}`)
            .then(res => res.json())
            .then(data => {
                setRankings(data);
                setLoading(false);
            });
    }, [tab]);

    const medals = ['🥇', '🥈', '🥉'];

     return (
        <div className="ranking-container">

            <button 
            onClick={() => navigate('/home')}
            className="ranking-back-btn"
        >
            ← VOLVER AL INICIO
        </button>
        
            <h1 className="ranking-title">🏆 RANKING</h1>

            {/* Tabs de juegos */}
            <div className="ranking-tabs">
                {games.map(game => (
                    <button
                        key={game.id}
                        className={`ranking-tab ${tab === game.id ? 'active' : ''}`}
                        onClick={() => setTab(game.id)}
                    >
                        {game.emoji} {game.name}
                    </button>
                ))}
            </div>

            {/* Tabla */}
            <div className="ranking-table">
                {loading ? (
                    <p className="ranking-loading">Cargando...</p>
                ) : rankings.length === 0 ? (
                    <p className="ranking-empty">Aún no hay partidas registradas</p>
                ) : (
                    rankings.map((match, index) => (
                        <div key={index} className={`ranking-row ${index < 3 ? 'top-three' : ''}`}>
                            <span className="ranking-pos">
                                {index < 3 ? medals[index] : `#${index + 1}`}
                            </span>
                            <span className="ranking-username">{match.username}</span>
                            <span className="ranking-score">{match.score} pts</span>
                            <span className="ranking-duration">{match.durationSeconds}s</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

}

export default Ranking;