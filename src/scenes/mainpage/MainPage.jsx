import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './mainpage.css';

import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { login } from '../../components/TokenApi';

import image1 from '../../assets/image1.png';
import image2 from '../../assets/image2.png';
import image3 from '../../assets/image3.png';
import image4 from '../../assets/image4.png';

const MainPage = () => {
    const [isRegister, setIsRegister] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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

    const moveDot = (index) => {
        setSlideIndex(index);
    };
    
    useEffect(()=>{
        const interval = setInterval(()=>{
            nextSlide();        
        }, 4000);
        return () => clearInterval(interval);
    });

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