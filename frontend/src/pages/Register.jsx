import React, { useState, useEffect } from 'react';
import RegisterHotel from '../components/RegisterUsuario';
import axios from 'axios';
import '../styles/RegisterUsuario.css'; // Asegúrate de tener este archivo CSS


function Register() {
    const [roles, setRoles] = useState([]);
    const [registrationError, setRegistrationError] = useState(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

useEffect(() => {
    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/auth/roles-usuario-cliente');
            console.log('Respuesta de roles:', response.data); // <-- ¡Sigue siendo útil para depurar!
            if (response.data.success) {
                const rolesData = response.data.data; // Accede a la propiedad 'data'
                setRoles(Object.entries(rolesData).map(([nombre_rol, id_rol]) => ({ id_rol, nombre_rol })));
            } else {
                console.error('Error al cargar roles:', response.data.message);
                setRegistrationError('Error al cargar los roles. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error al obtener roles:', error);
            setRegistrationError('Error al cargar los roles. Por favor, intenta de nuevo.');
        }
    };

    fetchRoles();
}, []);

    const handleSubmit = async (formData) => {
        if (formData.contrasena_usuario !== formData.confirmar_contrasena) {
            setRegistrationError('Las contraseñas no coinciden.');
            return false; // Indicate failure
        }

        try {
            const response = await axios.post('http://localhost:3000/api/auth/registrar', formData);
            console.log('Usuario registrado con éxito', response.data);
            setRegistrationError(null); // Clear any previous errors
            setRegistrationSuccess(true);
            return true; // Indicate success
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            setRegistrationError(error.response?.data?.error || 'Error al registrar el usuario. Por favor, intenta de nuevo.');
            return false; // Indicate failure
        }
    };

    return (
        <div className="container-general">
            <div className="register-page">
                {registrationError && <p className="error-message">{registrationError}</p>}
                {registrationSuccess ? (
                    <p className="success-message">Registro exitoso. ¡Puedes iniciar sesión!</p>
                ) : (
                    <RegisterHotel roles={roles} onSubmit={handleSubmit} />
                )}
            </div>
        </div>
    );
}

export default Register;