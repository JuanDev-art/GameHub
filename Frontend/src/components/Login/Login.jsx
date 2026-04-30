import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import './Login.css';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modal, setModal] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Si ya hay un token en el localStorage, lo mandamos al Home
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home'); 
        }
    }, [navigate]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch("http://localhost:8080/api/auth/login", {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),

            });

            if (response.ok) {
                const data = await response.json();
                //Guardamos token para futuras peticiones
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('role', data.role);

                setModal({ type: 'success', message: `¡Bienvenido de nuevo, ${data.username}!` });

            } else {
                setModal({ type: 'error', message: 'Email o password incorrectos. ¡Inténtalo de nuevo!' });
            }

            } catch (error) {
                console.error("Error en el login:", error);

        }
    };

  return (
    <div className='login-container'>
        <form className='login-form' onSubmit={handleSubmit}>
            <h2 className='login-title'>Player Login</h2>

            <div className="input-group">
                <label>Email</label>
                <input 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />

            </div>

            <div className="input-group">
                <label>Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
            </div>

            <button type='submit' className='login-button'>Start Session</button>
            <p className='register-link'> ¿No tienes cuenta? <span onClick={() => navigate('/register')}> Regístrate aquí </span></p>

        </form>
        
        {/* Modal */}
        {modal && (
            <Modal
                type={modal.type}
                message={modal.message}
                onClose={() => {
                    if (modal.type === 'success') navigate('/home');
                    setModal(null);
                }}
            />
        )}


    </div>
  );
}

export default Login