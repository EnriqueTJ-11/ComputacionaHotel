// LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginUsuario.css';
import hotelRoomImage from '../assets/hotel-room.jpg'; // Asegúrate de tener esta imagen

const LoginPage = ({ onSubmit, onChange, formData }) => { // Recibe onSubmit, onChange y formData como props
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmitLocal = (e) => {
        e.preventDefault();
        onSubmit(e); // Llama a la función onSubmit que viene del padre (InicioSesion)
    };

    return (
        <div className="container-general">
            <div className="login-container">
                <div className="login-card">
                    <div className="hotel-image">
                        <img src={hotelRoomImage} alt="Habitación de hotel" />
                    </div>
                    <div className="login-form-container">
                        <h1 className="login-title">Iniciar sesión</h1>

                        <form onSubmit={handleSubmitLocal} className="login-form"> {/* Usa handleSubmitLocal */}
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon user-icon">👤</i>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email_usuario"
                                        value={formData.email_usuario}
                                        onChange={onChange} // Usa la función onChange que viene del padre
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
                                        id="password"
                                        name="contrasena_usuario"
                                        value={formData.contrasena_usuario}
                                        onChange={onChange} // Usa la función onChange que viene del padre
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
                                        name="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label htmlFor="remember">Recordar</label>
                                </div>
                                <Link to="/register" className="new-account">Crear cuenta</Link>
                            </div>

                            <button type="submit" className="login-button">INGRESAR</button> {/* Cambia el Link a un button de tipo submit */}

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;