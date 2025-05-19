// pages/inicioSesion.jsx
import React, { useState, useEffect, useContext  } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useContext
import LoginPage from '../components/LoginUsuario';
import { AuthContext } from '../App'; // Importa el contexto de autenticación

const InicioSesion = () => {
  const [formData, setFormData] = useState({
    email_usuario: '',
    contrasena_usuario: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useContext(AuthContext); // Usa el contexto para actualizar el estado global

  // Verificar si viene de un cierre de sesión exitoso
  useEffect(() => {
    if (location.state?.logoutSuccess) {
      setSuccessMessage('Sesión cerrada correctamente');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Verificar si ya hay un token activo
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/inicio');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    console.log('Intentando iniciar sesión con:', formData);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData);
      console.log('Inicio de sesión exitoso', response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuarioId', response.data.usuarioId);

      console.log('Token guardado:', localStorage.getItem('token'));

      // Actualizar el estado de autenticación a través del contexto
      setIsAuthenticated(true);

      console.log('Navegando a /inicio');
      navigate('/inicio');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      const errorMsg = error.response?.data?.error || 'Error al iniciar sesión. Intente nuevamente.';
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="ingreso-page">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <LoginPage
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={formData}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default InicioSesion;