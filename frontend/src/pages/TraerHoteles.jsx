import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TraerHoteles() {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoteles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3000/query-ontologia');
        setHoteles(response.data); // La respuesta es directamente el array
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHoteles();
  }, []);

  if (loading) {
    return <div>Cargando hoteles...</div>;
  }

  if (error) {
    return <div>Error al cargar los hoteles: {error.message}</div>;
  }

  return (
    <div>
      <h2>Lista de Hoteles de la Ontología</h2>
      {hoteles.map((hotel, index) => (
        <div key={index}>
          <p>URI del Hotel: {hotel.hotel.value}</p> {/* Accedemos a hotel.hotel.value */}
        </div>
      ))}
    </div>
  );
}

export default TraerHoteles;