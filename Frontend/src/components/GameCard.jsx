import { Link } from "react-router-dom";

function GameCard({ game }) {

    return (
        <Link to={`/game/${game.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        
            <div style={{
                border: "1px solid #49870f",
                padding: "16px",
                margin: "10px",
                borderRadius: "10px",
                width: "200px",
                cursor: "pointer"
            }}>
                <h3>{game.name}</h3>
                <p>{game.description}</p>
                <p><strong>Dificultad:</strong> {game.difficulty}</p>
            </div>
        </Link>
    )
}

export default GameCard;