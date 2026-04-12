import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import "./App.css"; 

function App() {
  return (
  <BrowserRouter>
    <header style={{ padding: '20px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
      <h1 className="game-title" style={{ fontSize: '3rem', margin: 0 }}>GameHub</h1>
        <p style={{ fontFamily: 'VT323', fontSize: '1.2rem', color: '#666' }}>
          Plataforma de videojuegos 2D
        </p>
    </header>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:id" element={<GamePage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;