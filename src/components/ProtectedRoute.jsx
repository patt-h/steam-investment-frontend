import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { verifyToken } from './TokenApi'; 

const ProtectedRoute = ({ element: Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    await verifyToken(token);
                    setIsAuthenticated(true);
                } catch (err) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        };

        checkAuthentication();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? (
        <Element />
    ) : (
        <Navigate to="/" state={{ from: location }} />
    );
};

export default ProtectedRoute;