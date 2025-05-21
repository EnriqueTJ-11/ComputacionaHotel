import React, { useState, useEffect } from 'react';
import '../styles/RegisterHospedaje.css';

const API_BASE_URL = 'http://localhost:3000/api/ontologia'; // <--- ¡AJUSTA ESTO SEGÚN TU CONFIGURACIÓN!

const RegisterHotel = () => {
    const [formData, setFormData] = useState({
        nombre_alojamiento: '',
        emailContacto: '',
        direccionEstablecimiento: '',
        descripcionEstablecimiento: '',
        numero_establecimiento: '',
        capacidad_total: '',
        num_habitaciones: '',
        tipoEstablecimientoId: '',
        latitud: '',          // Inicializar como cadena vacía para inputs de texto/número
        longitud: '',         // Inicializar como cadena vacía
        horarioApertura: '',  // Inicializar como cadena vacía
        horarioCierre: '',    // Inicializar como cadena vacía
        esAccesible: false,   // Inicializar con un valor booleano o false por defecto
        categoria: ''         // <--- Asegurarnos de que es 'categoria' en minúsculas
    });

    const [tiposAlojamiento, setTiposAlojamiento] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // ... (El resto del useEffect para cargar tiposAlojamiento es el mismo) ...
    useEffect(() => {
        const fetchTiposAlojamiento = async () => {
            try {
                setLoading(true);
                setErrorMessage(null);
                const response = await fetch(`${API_BASE_URL}/tiposAlojamiento`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al obtener tipos de alojamiento');
                }
                const data = await response.json();
                setTiposAlojamiento(data.data);
            } catch (err) {
                console.error("Error al cargar tipos de alojamiento:", err);
                setError(err.message);
                setErrorMessage("No se pudieron cargar los tipos de establecimiento.");
            } finally {
                setLoading(false);
            }
        };

        fetchTiposAlojamiento();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target; // Añadir type y checked para checkboxes
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value // Manejar checkboxes
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);

        // Limpiar campos vacíos o null antes de enviar para evitar enviar 'null' o '' si no se requiere un tipo específico
        const dataToSend = { ...formData };
        for (const key in dataToSend) {
            // Convertir cadenas vacías de campos numéricos a null o undefined para que el backend las ignore si son opcionales
            if (['capacidad_total', 'num_habitaciones', 'latitud', 'longitud'].includes(key)) {
                if (dataToSend[key] === '' || isNaN(parseFloat(dataToSend[key]))) {
                    dataToSend[key] = null; // O undefined, dependiendo de cómo quieras que el backend lo vea
                } else if (key === 'capacidad_total' || key === 'num_habitaciones') {
                    dataToSend[key] = parseInt(dataToSend[key]); // Asegurar que sean enteros para el backend
                } else if (key === 'latitud' || key === 'longitud') {
                    dataToSend[key] = parseFloat(dataToSend[key]); // Asegurar que sean floats
                }
            } else if (dataToSend[key] === '') { // Otros campos de texto opcionales vacíos
                dataToSend[key] = null;
            }
        }
        // Asegurarse de que esAccesible sea boolean (true/false) o null si no se marca
        if (dataToSend.esAccesible === false) { // Si no está marcado y es false, envíalo
            // Ya está manejado por type === 'checkbox' ? checked : value
        }


        try {
            const response = await fetch(`${API_BASE_URL}/alojamiento`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend), // Enviamos los datos procesados
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar el establecimiento.');
            }

            const result = await response.json();
            console.log('Registro exitoso:', result);
            setSuccessMessage('¡Establecimiento registrado con éxito!');
            // Limpiar el formulario
            setFormData({
                nombre_alojamiento: '', emailContacto: '', direccionEstablecimiento: '',
                descripcionEstablecimiento: '', numero_establecimiento: '', capacidad_total: '',
                num_habitaciones: '', tipoEstablecimientoId: '', latitud: '', longitud: '',
                horarioApertura: '', horarioCierre: '', esAccesible: false, categoria: ''
            });

        } catch (err) {
            console.error('Error durante el registro:', err);
            setErrorMessage(err.message || 'Hubo un problema al registrar el establecimiento.');
        }
    };

    if (loading) {
        return <div className="register-card">Cargando tipos de establecimiento...</div>;
    }

    return (
        <div className="pag-fondo">
            <div className="register-card">
                <div className="register-hospedaje-container">
                    <h1 className="register-title">Registro de Establecimiento</h1>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-columns">
                            <div className="form-column">
                                {/* Campos existentes */}
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon building-icon">🏢</i>
                                        <input type="text" id="nombre_alojamiento" name="nombre_alojamiento" value={formData.nombre_alojamiento} onChange={handleChange} placeholder="Nombre del establecimiento" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon email-icon">📧</i>
                                        <input type="email" id="emailContacto" name="emailContacto" value={formData.emailContacto} onChange={handleChange} placeholder="Email de contacto" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon map-pin-icon">📍</i>
                                        <input type="text" id="direccionEstablecimiento" name="direccionEstablecimiento" value={formData.direccionEstablecimiento} onChange={handleChange} placeholder="Dirección del establecimiento" required />
                                    </div>
                                </div>
                                {/* Campos opcionales adicionales */}
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon map-marker-alt-icon">🌐</i> {/* Icono para latitud */}
                                        <input type="number" step="any" id="latitud" name="latitud" value={formData.latitud} onChange={handleChange} placeholder="latitud" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon map-marker-alt-icon">🌐</i> {/* Icono para longitud */}
                                        <input type="number" step="any" id="longitud" name="longitud" value={formData.longitud} onChange={handleChange} placeholder="longitud" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon file-text-icon">📄</i>
                                        <textarea id="descripcionEstablecimiento" name="descripcionEstablecimiento" value={formData.descripcionEstablecimiento} onChange={handleChange} placeholder="Descripción del establecimiento" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-column">
                                {/* Campos existentes */}
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon phone-icon">📞</i>
                                        <input type="text" id="numero_establecimiento" name="numero_establecimiento" value={formData.numero_establecimiento} onChange={handleChange} placeholder="Numero Telefonico" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon users-icon">👥</i>
                                        <input type="number" id="capacidad_total" name="capacidad_total" value={formData.capacidad_total} onChange={handleChange} placeholder="Capacidad Total" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon bed-icon">🛏️</i>
                                        <input type="number" id="num_habitaciones" name="num_habitaciones" value={formData.num_habitaciones} onChange={handleChange} placeholder="Número de habitaciones" required />
                                    </div>
                                </div>
                                <h4>Horario de Apertura</h4>
                                {/* Campo de categoría (asegúrate de que el 'name' es 'categoria' en minúsculas) */}
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon clock-icon">⏰</i> {/* Icono para horario */}
                                        <input type="time" id="horarioApertura" name="horarioApertura" value={formData.horarioApertura} onChange={handleChange} placeholder="Horario de Apertura" />
                                    </div>
                                </div>
                                <h4>Horario de Cierre</h4>
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon clock-icon">⏰</i>
                                        <input type="time" id="horarioCierre" name="horarioCierre" value={formData.horarioCierre} onChange={handleChange} placeholder="Horario de Cierre" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon users-icon">👥</i>
                                        <input type="number" id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} placeholder="Categoria" required />
                                    </div>
                                </div>
                                {/* Selector de Tipo de Establecimiento */}
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon tag-icon">🏷️</i>
                                        <select id="tipoEstablecimientoId" name="tipoEstablecimientoId" value={formData.tipoEstablecimientoId} onChange={handleChange} required>
                                            <option value="">Seleccionar Tipo de Establecimiento</option>
                                            {tiposAlojamiento.map(tipo => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.name}
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
        </div>
    );
};

export default RegisterHotel;