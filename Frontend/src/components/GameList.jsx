import { useEffect, useState } from "react"
import GameCard from "./GameCard"

function GameList() {
  // Guardamos la lista de juegos.
  const [games, setGames] = useState([])

  // Se ejecuta cuando la página se carga.
  useEffect(() => {
    fetch("http://localhost:8080/api/games") // Hace la llamada a la API.
    .then(response => response.json())
    .then(data => {
        setGames(data)
    })
    .catch((error) => console.error("Error cargando juegos:", error));
  }, [])

  return (
    <main className="main-content">
      {/* Título principal con la fuente retro VT323 */}
      <h2 
        className="game-title" 
        style={{ textAlign: "center", marginTop: "30px", fontSize: "3rem" }}
      >
        Selecciona tu juego
      </h2>

      {/* Contenedor Flexbox para las tarjetas */}
      <div className="game-card-container">
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))
        ) : (
          <p style={{ fontFamily: 'VT323', fontSize: '1.5rem' }}>Cargando juegos...</p>
        )}
      </div>
    </main>
  );
}

export default GameList;