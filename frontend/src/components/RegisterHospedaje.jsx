import React, { useState } from 'react';
import '../styles/RegisterHospedaje.css';
import { Link } from 'react-router-dom';

const RegisterHotel = ({ roles, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre_alojamiento: '', 
        emailContacto: '', 
        direccionEstablecimiento: '', 
        descripcionEstablecimiento: '',
        numero_establecimiento: '',
        capacidad_total: '',
        num_habitaciones: '', 
        tipoEstablecimientoId: '' 
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
        setPasswordMatchError(formData.contrasena !== formData.confirmarContrasena);

        if (passwordMatchError) {
            return;
        }
        onSubmit({
            email_usuario: formData.emailContacto,
            contrasena_usuario: formData.contrasena,
            confirmar_contrasena: formData.confirmarContrasena,
            nombre1_usuario: formData.nombreEstablecimiento,
            nombre2_usuario: '', // No hay un campo directamente mapeado, podrías usar otro o dejar vacío
            apellido1_usuario: formData.direccionEstablecimiento,
            apellido2_usuario: formData.descripcionEstablecimiento,
            rol_id: formData.tipoEstablecimientoId
        });
    };

    return (
        <div className="register-card">
            <div className="register-form-container">
                <h1 className="register-title">Registro de Establecimiento</h1>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon building-icon">🏢</i>
                                    <input
                                        type="text"
                                        id="nombreEstablecimiento"
                                        name="nombreEstablecimiento"
                                        value={formData.nombreEstablecimiento}
                                        onChange={handleChange}
                                        placeholder="Nombre del establecimiento"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon email-icon">📧</i>
                                    <input
                                        type="email"
                                        id="emailContacto"
                                        name="emailContacto"
                                        value={formData.emailContacto}
                                        onChange={handleChange}
                                        placeholder="Email de contacto"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon map-pin-icon">📍</i>
                                    <input
                                        type="text"
                                        id="direccionEstablecimiento"
                                        name="direccionEstablecimiento"
                                        value={formData.direccionEstablecimiento}
                                        onChange={handleChange}
                                        placeholder="Dirección del establecimiento"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-column">
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon file-text-icon">📄</i>
                                    <textarea
                                        id="descripcionEstablecimiento"
                                        name="descripcionEstablecimiento"
                                        value={formData.descripcionEstablecimiento}
                                        onChange={handleChange}
                                        placeholder="Descripción del establecimiento"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon key-icon">🔑</i>
                                    <input
                                        type="password"
                                        id="contrasena"
                                        name="contrasena"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        placeholder="Contraseña"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon key-icon">🔑</i>
                                    <input
                                        type="password"
                                        id="confirmarContrasena"
                                        name="confirmarContrasena"
                                        value={formData.confirmarContrasena}
                                        onChange={handleChange}
                                        placeholder="Confirmar contraseña"
                                        required
                                    />
                                </div>
                                {passwordMatchError && <p className="error-message">Las contraseñas no coinciden</p>}
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon tag-icon">🏷️</i>
                                    <select
                                        id="tipoEstablecimientoId"
                                        name="tipoEstablecimientoId"
                                        value={formData.tipoEstablecimientoId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar Tipo de Establecimiento</option>
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
                        <button type="submit" className="register-button">REGISTRAR ESTABLECIMIENTO</button>
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