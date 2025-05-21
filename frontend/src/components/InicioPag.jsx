// src/components/InicioPag.jsx
import React from 'react';
import '../styles/InicioPag.css'; // Importa los estilos CSS
import imagen from '../assets/hotel.jpg'; // Asegúrate de que la ruta sea correcta

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
              <div className="hotel-image-container">
                {/* Aquí utilizamos la imagen del hotel o una imagen por defecto */}
                <img
                  src={imagen}
                  alt={"Imagen del hotel"}
                  className="hotel-image"
                />
              </div>
              <div className="hotel-info">
                <h3 className="hotel-name">{hotel.nombre}</h3>
                <p className="hotel-description">{hotel.descripcion}</p>
                <div className="hotel-details">
                  <span className="hotel-capacity">
                    <i className="capacity-icon">👥</i> {hotel.capacidad} huéspedes
                  </span>
                  <span className="hotel-category">
                    <i className="category-icon">⭐</i> {hotel.categoria}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-hoteles-message">
            <i className="empty-icon">🏨</i>
            <p>No se encontraron hoteles disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InicioPag;