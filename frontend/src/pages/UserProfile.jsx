// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Asegúrate de que cualquier otro import que necesites esté aquí
// Por ejemplo, si tienes un componente de navegación u otros estilos.

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      console.log('Frontend - Token obtenido de localStorage:', token);

      if (!token) {
        setError("No hay token de autenticación. Por favor, inicia sesión.");
        setLoading(false);
        return; // Detiene la ejecución si no hay token
      }

      try {
        const response = await axios.get('http://localhost:3000/api/auth/perfil', {
          headers: {
            Authorization: `Bearer ${token}` // Envía el token en el encabezado
          }
        });
        // Aquí accedes a la propiedad 'data' que contiene los datos del usuario
        setUser(response.data.data);
      } catch (err) {
        console.error("Error al cargar el perfil del usuario:", err);
        if (err.response) {
            if (err.response.status === 401 || err.response.status === 403) {
                setError("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
            } else if (err.response.status === 404) {
                setError("Ruta del perfil no encontrada. Verifica la URL.");
            } else {
                setError(err.response.data?.message || 'Error al cargar el perfil. Intenta de nuevo más tarde.');
            }
        } else {
            setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
        }
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchUserProfile();
  }, []);

  // ***************************************************************
  // ********* ESTA ES LA SECCIÓN DEL RETURN QUE TE FALTA *********
  // ***************************************************************
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {loading && <p>Cargando perfil del usuario...</p>}

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}

      {/* Solo mostramos la información del usuario si 'user' tiene datos */}
      {user ? (
        <div>
          <h2 style={{ color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Mi Perfil</h2>
          <p><strong>ID de Usuario:</strong> {user.id_usuario}</p>
          <p><strong>Email:</strong> {user.email_usuario}</p>
          <p><strong>Primer Nombre:</strong> {user.nombre1_usuario}</p>
          <p><strong>Segundo Nombre:</strong> {user.nombre2_usuario}</p>
          <p><strong>Primer Apellido:</strong> {user.apellido1_usuario}</p>
          <p><strong>Segundo Apellido:</strong> {user.apellido2_usuario}</p>
          <p><strong>Nacionalidad:</strong>{user.Nacionalidad}</p>
          <p><strong>Telefono:</strong>{user.Telefono}</p>
          <p><strong>Nacimiento:</strong>{user.Nacimiento}</p>
          {/* Si tienes más campos en la respuesta del backend, añádelos aquí:
          <p><strong>Nacionalidad:</strong> {user.Nacionalida}</p>
          <p><strong>Teléfono:</strong> {user.Telefono}</p>
          <p><strong>Nacimiento:</strong> {user.Nacimiento}</p>
          */}
        </div>
      ) : (
        // Esto se mostrará si no está cargando, no hay error, y 'user' es null (ej. si el token no existe)
        !loading && !error && <p>No se encontraron datos del perfil. Por favor, inicia sesión o intenta de nuevo.</p>
      )}
    </div>
  );
};

export default UserProfile;