import React, { useState } from 'react';
import '../styles/RegisterHospedaje.css';

const RegisterHotel = ({ roles, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre_alojamiento: '', 
        emailContacto: '', 
        direccionEstablecimiento: '', 
        descripcionEstablecimiento: '',
        numero_establecimiento: '', // Asumiendo que es el número de contacto
        capacidad_total: '', // Asumiendo que es la capacidad máxima
        num_habitaciones: '', // Asumiendo que es el número de habitaciones
        tipoEstablecimientoId: '' 
    });
    // Eliminamos passwordMatchError del estado si ya no manejamos contraseñas aquí
    // const [passwordMatchError, setPasswordMatchError] = useState(false); // <--- Puedes quitar esto si no hay campos de contraseña aquí

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Si ya no hay campos de contraseña en este formulario, estas líneas no son necesarias
        // setPasswordMatchError(formData.contrasena !== formData.confirmarContrasena);
        // if (passwordMatchError) {
        //     return;
        // }

        onSubmit(formData); // Pasamos todo el formData
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
                                        id="nombre_alojamiento"
                                        name="nombre_alojamiento"
                                        value={formData.nombre_alojamiento}
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
                                        required // Email es crucial, lo hice requerido
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
                        </div>
                        
                        <div className="form-column">
                           
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon phone-icon">📞</i> {/* Icono de teléfono */}
                                    <input
                                        type="text" // Cambiado a text para números de teléfono
                                        id="numero_establecimiento"
                                        name="numero_establecimiento"
                                        value={formData.numero_establecimiento}
                                        onChange={handleChange}
                                        placeholder="Numero Telefonico"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon users-icon">👥</i> {/* Icono de usuarios para capacidad */}
                                    <input
                                        type="number" // Cambiado a number para capacidad
                                        id="capacidad_total"
                                        name="capacidad_total"
                                        value={formData.capacidad_total}
                                        onChange={handleChange}
                                        placeholder="Capacidad Total"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon bed-icon">🛏️</i> {/* Icono de cama para habitaciones */}
                                    <input
                                        type="number" // Cambiado a number para habitaciones
                                        id="num_habitaciones"
                                        name="num_habitaciones"
                                        value={formData.num_habitaciones}
                                        onChange={handleChange}
                                        placeholder="Número de habitaciones"
                                        required
                                    />
                                </div>
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
                                        {/* Aquí está la clave para evitar el error: verifica si 'roles' existe y es un array */}
                                        {roles && Array.isArray(roles) && roles.map(rol => (
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterHotel;