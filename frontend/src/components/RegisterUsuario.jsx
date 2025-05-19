import React, { useState } from 'react';
import '../styles/RegisterUsuario.css';
import { Link } from 'react-router-dom';

const RegisterHotel = ({ roles, onSubmit }) => {
    const [formData, setFormData] = useState({
        email_usuario: '',
        contrasena_usuario: '',
        confirmar_contrasena: '',
        nombre1_usuario: '',
        nombre2_usuario: '',
        apellido1_usuario: '',
        apellido2_usuario: '',
        rol_id: ''
    });
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPasswordMatchError(formData.contrasena_usuario !== formData.confirmar_contrasena);

        if (passwordMatchError) {
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="register-card">
            <div className="register-form-container">
                <h1 className="register-title">Registro de Usuario</h1>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon person-icon">👤</i>
                                    <input
                                        type="text"
                                        id="nombre1_usuario" // Añadido id
                                        name="nombre1_usuario"
                                        value={formData.nombre1_usuario}
                                        onChange={handleChange}
                                        placeholder="Primer Nombre"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon person-icon">👤</i>
                                    <input
                                        type="text"
                                        id="nombre2_usuario" // Añadido id
                                        name="nombre2_usuario"
                                        value={formData.nombre2_usuario}
                                        onChange={handleChange}
                                        placeholder="Segundo Nombre (Opcional)"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon person-icon">👤</i>
                                    <input
                                        type="text"
                                        id="apellido1_usuario" // Añadido id
                                        name="apellido1_usuario"
                                        value={formData.apellido1_usuario}
                                        onChange={handleChange}
                                        placeholder="Primer Apellido"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon person-icon">👤</i>
                                    <input
                                        type="text"
                                        id="apellido2_usuario" // Añadido id
                                        name="apellido2_usuario"
                                        value={formData.apellido2_usuario}
                                        onChange={handleChange}
                                        placeholder="Segundo Apellido (Opcional)"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-column">
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon user-icon">@</i>
                                    <input
                                        type="email"
                                        id="email_usuario" // Añadido id
                                        name="email_usuario"
                                        value={formData.email_usuario}
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
                                        id="contrasena_usuario" // Añadido id
                                        name="contrasena_usuario"
                                        value={formData.contrasena_usuario}
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
                                        id="confirmar_contrasena" // Añadido id
                                        name="confirmar_contrasena"
                                        value={formData.confirmar_contrasena}
                                        onChange={handleChange}
                                        placeholder="Confirmar Contraseña"
                                        required
                                    />
                                </div>
                                {passwordMatchError && <p className="error-message">Las contraseñas no coinciden</p>}
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon person-icon">🏷️</i>
                                    <select
                                        id="rol_id" // Añadido id
                                        name="rol_id"
                                        value={formData.rol_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar Rol</option>
                                        {roles.map(rol => (
                                            <option key={rol.id_rol} value={rol.id_rol}>
                                                {rol.nombre_rol}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="register-button">REGISTRAR USUARIO</button>
                        <p className="login-link">
                            ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterHotel;