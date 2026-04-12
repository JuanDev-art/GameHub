import { Link } from "react-router-dom";

function GameCard({ game }) {
    return (
        <Link to={`/game/${game.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            
            <div className="game-card">
                
                
                <img 
                    src={game.id === 1 ? "/assets/fruitbasket_card.png" : "/assets/crocodile_card.png"} 
                    alt={game.name} 
                    className="game-card-img" 
                />
                
               
                <div className="game-card-body">
                   
                    <h3 className="game-title">{game.name}</h3>
                    
                    
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