import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mainpage.css';

import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { login } from '../../components/TokenApi';

const MainPage = () => {
    const [isRegister, setIsRegister] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await login({ username, password });
            if (data.token) {
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <main className="specific-page">
                <div className="canvas-container">
                    <canvas id="backgroundCanvas"></canvas>
                </div>
                <div className="container">
                    <div className="welcome-message">
                        <h1>Steam Investment Helper</h1>
                        <p>Track all of your investments with current price, profit and price history</p>
                        <p>Log in or sign up for free!</p>
                    </div>

                    <div className='wrapper'>
                        <form onSubmit={handleLogin}>
                            <h1>{isRegister ? 'Register' : 'Login'}</h1>
                            {isRegister && (
                                <div className="input-box">
                                    <input type="email" placeholder="Email" required />
                                    <FaEnvelope className='icon' />
                                </div>
                            )}
                            <div className="input-box">
                                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                <FaUser className='icon' />
                            </div>
                            <div className="input-box">
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <FaLock className='icon' />
                            </div>

                            {!isRegister && (
                                <div className="remember-forgot">
                                    <label><input type="checkbox" />Remember me</label>
                                    <a href="#">Forgot password?</a>
                                </div>
                            )}

                            <button type="submit">{isRegister ? 'Register' : 'Login'}</button>

                            <div className="register-link">
                                <p>{isRegister ? 'Already have an account?' : "Don't have an account?"} <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); }}>{isRegister ? 'Login' : 'Register'}</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );

}

export default MainPage;