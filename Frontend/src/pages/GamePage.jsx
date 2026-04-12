import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FruitBasket from "./FruitBasket";
import Crocodile from "./Crocodile.jsx";

function GamePage() {
    const { id } = useParams();
    const [game, setGame] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/games/${id}`)
            .then(response => response.json())
            .then(data => setGame(data));
    }, [id]);

    if (!game) return <p>Cargando...</p>;

    return (
        <div style={{ textAlign: "center" }}>
            <h1 className="game-title-section">{game.name}</h1>
            <p>{game.description}</p>
            <p><strong>Dificultad:</strong> {game.difficulty}</p>

            {/* Lógica de selección */}
            {id === "1" && <FruitBasket gameId={id} />}
            {id === "2" && <Crocodile gameId={id} />} 
        </div>
    );
}

export default GamePage;