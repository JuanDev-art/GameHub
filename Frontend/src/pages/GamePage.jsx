import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FruitBasket from "./FruitBasket";
import Crocodile from "./Crocodile.jsx";


function GamePage() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/api/games/${id}`)
            .then(response => response.json())
            .then(data => setGame(data));
    }, [id]);

    if (!game) return <p>Cargando...</p>;

    return (
    <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        boxSizing: 'border-box',
    }}>

       {/* Contenedor que agrupa botón + juego */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '800px' }}>
            <button
                onClick={() => navigate('/home')}
                style={{
                    background: 'transparent',
                    border: '2px solid #57606f',
                    color: '#aaa',
                    padding: '6px 16px',
                    fontFamily: "'VT323', monospace",
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    alignSelf: 'flex-start',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.borderColor = '#2ecc71'}
                onMouseLeave={e => e.target.style.borderColor = '#57606f'}
            >
                ← VOLVER AL INICIO
            </button>

        {id === "1" && <FruitBasket gameId={id} />}
        {id === "2" && <Crocodile gameId={id} />}
    </div>
</div>
);
}

export default GamePage;