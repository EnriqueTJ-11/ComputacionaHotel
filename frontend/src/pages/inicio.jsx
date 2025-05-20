// src/pages/Inicio.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InicioPag from '../components/InicioPag'; // Importa el componente de diseño
import '../styles/InicioPag.css'; // Si tienes estilos para esta página (puede que sean los mismos que usa InicioPag)

function Inicio() {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoteles = async () => {
      try {
        // Asegúrate de que esta URL coincida con la ruta de tu backend
        const response = await axios.get('http://localhost:3000/api/ontologia/query');
        console.log('Datos de hoteles recibidos:', response.data.data); // Los datos están en response.data.data
        setHoteles(response.data.data);
      } catch (err) {
        console.error('Error al cargar los hoteles desde la ontología:', err);
        setError('Error al cargar los hoteles. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchHoteles();
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

  // Aquí puedes manejar los estados de carga y error si quieres
  if (loading) {
    return <div className="loading-message">Cargando hoteles...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="inicio-container"> {/* Puedes poner un contenedor principal si lo necesitas */}
      {/* Pasamos los hoteles como una prop al componente de diseño */}
      <InicioPag hoteles={hoteles} />
    </div>
  );
}

export default Inicio;