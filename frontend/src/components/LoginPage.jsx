// LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import hotelRoomImage from '../assets/hotel-room.jpg'; // Asegúrate de tener esta imagen

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password, rememberMe });
    // Aquí implementarías la lógica de autenticación
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="hotel-image">
          <img src={hotelRoomImage} alt="Habitación de hotel" />
        </div>
        <div className="login-form-container">
          <h1 className="login-title">Iniciar sesión</h1>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <i className="icon user-icon">👤</i>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-icon-wrapper">
                <i className="icon lock-icon">🔒</i>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Recordar</label>
              </div>
              <Link to="/register" href="#" className="new-account">Crear cuenta</Link>
              
            </div>
            
            <button type="submit" className="login-button">INGRESAR</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;