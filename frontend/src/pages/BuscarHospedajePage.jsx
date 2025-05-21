// src/pages/BuscarHospedajePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BuscarHospedajeComponent from '../components/BuscarHospedaje'; 
import Reserva from '../components/Reserva';// Cambié el nombre para evitar confusión con la página
import '../styles/InicioPag.css'; // Asegúrate de que los estilos sean adecuados para esta página también

function BuscarHospedajePage() {
    const [hotelesBusqueda, setHotelesBusqueda] = useState([]); // Nombre diferente para distinguirlo
    const [loadingBusqueda, setLoadingBusqueda] = useState(true);
    const [errorBusqueda, setErrorBusqueda] = useState(null);

    useEffect(() => {
        const fetchHoteles = async () => {
            try {
                setLoadingBusqueda(true);
                const response = await axios.get('http://localhost:3000/api/ontologia/query'); // O '/api/ontologia/query' si es la misma consulta
                console.log('Datos de hospedajes para búsqueda recibidos:', response.data.data);
                setHotelesBusqueda(response.data.data);
            } catch (err) {
                console.error('Error al cargar los hospedajes para búsqueda:', err);
                setErrorBusqueda('Error al cargar los hospedajes. Intenta de nuevo más tarde.');
            } finally {
                setLoadingBusqueda(false);
            }
        };

        fetchHoteles();
    }, []);

    if (loadingBusqueda) {
        return <div className="loading-message">Cargando hospedajes...</div>;
    }

    if (errorBusqueda) {
        return <div className="error-message">{errorBusqueda}</div>;
    }

    return (
        <div className="buscar-hospedaje-page-container">
            {/* Pasamos los hoteles cargados a tu componente de presentación */}
            <BuscarHospedajeComponent hoteles={hotelesBusqueda} />
        </div>
    );
}

export default BuscarHospedajePage;