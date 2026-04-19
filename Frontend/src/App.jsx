import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import "./App.css"; 
import Login from "./components/Login/Login";
import Navbar from './components/Menu/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
     
      <Navbar /> 

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/" element={ <ProtectedRoute> <Home /> </ProtectedRoute>} />
        <Route path="/game/:id" element={<ProtectedRoute> <GamePage /> </ProtectedRoute>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;