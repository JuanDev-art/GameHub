import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login/Login.css';

const Register = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { username, email, password } = formData;

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = e => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

    const onSubmit = async (e) => {

        e.preventDefault();
        setError('');

        try {

            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            //Obtengo el mensaje de la respuesta del backend
            const message = await response.text();

            if (response.ok) {

                alert('¡Registro exitoso! Ya puedes entrar y disfrutar de todo el catálogo de juegos.');
                navigate('/login');

            } else {
                setError(message);
            }
        } catch (err) {
            setError('Error de conexión con el servidor.');
        }
    };

    return(
        <div className="login-container">
            <form className="login-form" onSubmit={onSubmit}>
                <h2 className="neon-text">Registro GameHub</h2>
                
                {/* Mensaje de error dinámico */}
                {error && (
                    <div style={{ 
                        color: '#ff4444', 
                        marginBottom: '15px', 
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        textShadow: '0 0 5px #ff0000'
                    }}>
                        {error}
                    </div>
                )}

                <div className="input-group">
                    <label>Nombre de Usuario</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={username} 
                        onChange={onChange} 
                        required 
                        placeholder="Ej: PlayerOne"
                    />
                </div>

                <div className="input-group">
                    <label>Correo Electrónico</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={email} 
                        onChange={onChange} 
                        required 
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div className="input-group">
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={onChange} 
                        required 
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>

                <button type="submit" className="login-btn neon-border">
                    ¡ÚNETE!
                </button>
                
                <p className="switch-auth" style={{ marginTop: '20px', textAlign: 'center' }}>
                    ¿Ya eres miembro? <Link to="/login" style={{ color: '#00f2ff' }}>Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;