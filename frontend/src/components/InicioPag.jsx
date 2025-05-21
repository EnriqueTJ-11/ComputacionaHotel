// src/components/InicioPag.jsx
import React from 'react';
import '../styles/InicioPag.css'; // Importa los estilos CSS

// El componente ahora recibe 'hoteles' como prop
function InicioPag({ hoteles }) {
  return (
    <div className="inicio-pag">
      <div className="titulo-bienvenida-container">
        <h1 className="titulo-bienvenida">¡Bienvenido A Tu Plataforma de Hospedaje!</h1>
      </div>
      <div className="contenedor-hoteles">
        {hoteles.length > 0 ? (
          hoteles.map((hotel, index) => (
            <div key={hotel.id_alojamiento || index} className="hotel-container">
              {/* Aquí usamos los datos del objeto 'hotel' */}
              <h3>{hotel.nombre}</h3>
              <p>{hotel.descripcion}</p>
              <p>Capacidad: {hotel.capacidad}</p>
              <p>Categoría: {hotel.categoria}</p>
              {/* Puedes añadir más información del hotel si la traes de la ontología */}
              {/* Por ejemplo: <p>Ubicación: {hotel.latitud}, {hotel.longitud}</p> */}
              {/* O un botón para ver más detalles */}
              {/* <button className="ver-detalles-btn">Ver Detalles</button> */}
            </div>
          ))
        ) : (
          // Mensaje si no hay hoteles o si la carga fue exitosa pero no hay datos
          <div className="no-hoteles-message">No se encontraron hoteles.</div>
        )}
      </div>
    </div>
  );
}

export default InicioPag;