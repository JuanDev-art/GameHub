import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import "./App.css"; 

function App() {
  return (
  <BrowserRouter>
    <header className="main-header">
        <h1 className="game-title">GameHub</h1>
        <p className="game-subtitle">Plataforma de videojuegos 2D</p>
   </header>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:id" element={<GamePage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;