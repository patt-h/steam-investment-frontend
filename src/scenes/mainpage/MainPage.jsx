import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import './mainpage.css';

import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { login, register } from '../../components/TokenApi';

import image1 from '../../assets/image1.png';
import image2 from '../../assets/image2.png';
import image3 from '../../assets/image3.png';
import image4 from '../../assets/image4.png';

const MainPage = () => {
    const [isRegister, setIsRegister] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isError, setIsError] = useState({ username: false, password: false });
    const [email, setEmail] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const images = [{id: 1, src: image1}, {id: 2, src: image2}, {id: 3, src: image3}, {id: 4, src: image4}]

    const [slideIndex, setSlideIndex] = useState(1);

    const nextSlide = () => {
        if (slideIndex !== images.length) {
          setSlideIndex(slideIndex + 1);
        } else if (slideIndex === images.length) {
          setSlideIndex(1);
        }
    };
    
    useEffect(()=>{
        const interval = setInterval(()=>{
            nextSlide();        
        }, 4000);
        return () => clearInterval(interval);
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await login({ username, password, rememberMe });
            if (data.token) {
                localStorage.setItem('token', data.token);
                navigate('/home');
            }
        } catch (err) {
            console.log(err)
            if (err.status === 404) {
                setError('User not found');
                setIsError({ username: true, password: true });
            } else if (err.status === 400) {
                setError('Incorrect password');
                setIsError({ username: false, password: true });
            } else {
                setError('An error occurred. Please try again.');
                setIsError({ username: true, password: true });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await register({ username, password, email });
            if (data.ok) {
                setRegisterSuccess(true);
            } else {
                setError('An error occurred. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
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
                        <p><b>Log in or sign up for free!</b></p>

                        <div className="container-slider">
                            {images.map((image, index) => (
                                <div 
                                    key={image.id}
                                    className={slideIndex === index + 1 ? "slide active-anim" : "slide"}
                                >
                                    <img src={image.src} alt={image.id} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='wrapper'>
                        {isLoading && (
                            <div className="loading-overlay">
                                <CircularProgress style={{ color: '#888' }} />
                            </div>
                        )}
                        {registerSuccess ? (
                            <div className="success-message">
                                <CheckCircleIcon style={{ color: "#22bb33", fontSize: '60' }}/>
                                <h2>Registration success!</h2>
                                <p>You have been successfully registered. To activate  your account check your email and confirm your registration!</p>
                            </div>
                        ) : (
                        <form onSubmit={isRegister ? handleRegister : handleLogin}>
                            <h1>{isRegister ? 'Register' : 'Login'}</h1>
                            {error && <div className="error-message">{error}</div>}
                            {isRegister && (
                                <div className="input-box">
                                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    <FaEnvelope className='icon' />
                                </div>
                            )}
                            <div className={`input-box ${isError.username ? 'input-error' : ''}`}>
                                <input type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value); setIsError({ ...isError, username: false }); }} className={isError.username ? 'input-error' : ''} required />
                                <FaUser className='icon' />
                            </div>
                            <div className={`input-box ${isError.password ? 'input-error' : ''}`}>
                                <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setIsError({ ...isError, password: false }); }} required />
                                <FaLock className='icon' />
                            </div>

                            {!isRegister && (
                                <div className="remember-forgot">
                                    <label><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />Remember me</label>
                                    <a href="#">Forgot password?</a>
                                </div>
                            )}

                            <button type="submit">{isRegister ? 'Register' : 'Login'}</button>

                            <div className="register-link">
                                <p>{isRegister ? 'Already have an account?' : "Don't have an account?"} <a href="#" onClick={(e) => { e.preventDefault(); setIsError({ ...isError, username: false, password: false }); setError(''); setIsRegister(!isRegister); }}>{isRegister ? 'Login' : 'Register'}</a></p>
                            </div>
                        </form>
                        )}
                    </div>
                </div>
            </main>
        </>
    );

}

export default MainPage;