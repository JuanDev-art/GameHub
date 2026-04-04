import { Link } from "react-router-dom";

function GameCard({ game }) {
    return (
        <Link to={`/game/${game.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            {/* 1. Usamos la clase game-card que tiene las animaciones */}
            <div className="game-card">
                
                {/* 2. Añadimos la imagen de portada según el juego */}
                <img 
                    src={game.id === 1 ? "/assets/fruitbasket_card.png" : "/assets/crocodile_card.png"} 
                    alt={game.name} 
                    className="game-card-img" 
                />
                
                {/* 3. Agrupamos los textos en el "cuerpo" de la tarjeta */}
                <div className="game-card-body">
                    {/* El título con la fuente retro */}
                    <h3 className="game-title">{game.name}</h3>
                    
                    {/* La descripción con el texto en gris */}
                    <p className="game-card-description">{game.description}</p>
                    
                    <p style={{ marginTop: "10px", color: "#2c3e50" }}>
                        <strong>Dificultad:</strong> <span style={{ color: "#4caf50", fontWeight: "bold" }}>{game.difficulty}</span>
                    </p>
                </div>

            </div>
        </Link>
    )
}

export default GameCard;