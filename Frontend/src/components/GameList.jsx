import { useEffect, useState } from "react"
import GameCard from "./GameCard"

function GameList() {
  //Guardamos la lista de juegos.
  const [games, setGames] = useState([])

  //Se ejecuta cuando la página se carga.
  useEffect(() => {

    fetch("http://localhost:8080/api/games") //Hace la llamada a la API.
    .then(response => response.json())
    .then(data => {
        setGames(data)
    })

  }, [])

  return (
    <>
      <h2>Lista de juegos</h2>

      <div style={{ 
                    
                    display: "flex",
                    flexWrap: "wrap"
      }}>
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}

      </div>
    </>
  )

}

export default GameList;