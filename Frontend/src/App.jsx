import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import "./App.css"; 
import Login from "./components/Login/Login";
import Navbar from './components/Menu/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Register';
import LandingPage from "./pages/Landing/LandingPage";

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Acuérdate de usar /home para evitar el choque que vimos antes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/game/:id" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;