// pages/inicio.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginPage from '../components/LoginUsuario'; // Asegúrate de que la ruta sea correcta

const InicioSesion = () => {
    const [formData, setFormData] = useState({
        email_usuario: '',
        contrasena_usuario: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Intentando iniciar sesión con:', formData);
        try {
            const response = await axios.post('http://localhost:3000/usuarios/login', formData);
            console.log('Inicio de sesión exitoso', response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('usuarioId', response.data.usuarioId);
            console.log('Token guardado:', localStorage.getItem('token'));
            console.log('Navegando a /inicio');
            navigate('/inicio');
        } catch (error) {
            console.error('Error al iniciar sesión', error.response?.data?.error || 'Error al iniciar sesión');
            setErrorMessage(error.response?.data?.error || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="ingreso-page">
            <LoginPage onSubmit={handleSubmit} onChange={handleChange} formData={formData} /> {/* Pasa onSubmit, onChange y formData como props */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default InicioSesion;