import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Si no hay token, lo mandamos al login 
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);

        if(payload.exp < now) {

            localStorage.clear();
            return <Navigate to="/login" replace />

        }
    } catch(error) {

        localStorage.clear();
        return <Navigate to="/login" replace />
    }

    // Si hay token, dejamos que vea el componente 
    return children;
};

export default ProtectedRoute;