import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import "./App.css"; 

function App() {
  return (
  <BrowserRouter>
    <header style={{ padding: '20px', borderBottom: '1px solid #eee', fontFamily: 'VT323' }}>
      <h1>🕹️ GameHub Classic</h1>
    </header>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:id" element={<GamePage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;