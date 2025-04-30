// RegisterHotel.jsx
import React, { useState } from 'react';
import '../styles/RegisterHotel.css';
import { Link } from 'react-router-dom';

const RegisterHotel = () => {
  const [formData, setFormData] = useState({
    hotelName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    phone: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Datos del registro:', formData);
    // Aquí implementarías la lógica para enviar los datos al servidor
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-form-container">
          <h1 className="register-title">Registro de Hotel</h1>
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-columns">
              {/* Columna izquierda */}
              <div className="form-column">
                <div className="form-group">
                  <div className="input-icon-wrapper">
                    <i className="icon hotel-icon">🏨</i>
                    <input 
                      type="text" 
                      name="hotelName"
                      value={formData.hotelName}
                      onChange={handleChange}
                      placeholder="Nombre del Hotel" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-icon-wrapper">
                    <i className="icon user-icon">👤</i>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Contraseña" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-icon-wrapper">
                    <i className="icon lock-icon">🔒</i>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirmar Contraseña" 
                      required 
                    />
                  </div>
                </div>
              </div>
              
              {/* Columna derecha */}
              <div className="form-column">
                <div className="form-group">
                  <div className="input-icon-wrapper">
                    <i className="icon location-icon">📍</i>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Dirección" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-icon-wrapper">
                    <i className="icon city-icon">🏙️</i>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ciudad" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-icon-wrapper">
                    <i className="icon phone-icon">📞</i>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Teléfono" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-icon-wrapper textarea-wrapper">
                    <i className="icon desc-icon">📝</i>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Descripción del hotel" 
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="register-button">REGISTRAR HOTEL</button>
              <p className="login-link">
                ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterHotel;