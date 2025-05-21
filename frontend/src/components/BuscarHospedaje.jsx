// src/components/BuscarHospedaje.jsx
import React from 'react';
import '../styles/InicioPag.css';
import Mapa from './HospedajeMapa'; // Asegúrate de que la ruta sea correcta
import Busqueda from '../components/Reserva';
import imagen from '../assets/hotel.jpg'; // Asegúrate de que la ruta sea correcta

// Este componente SOLO recibe 'hoteles'
function BuscarHospedaje({ hoteles }) {
    return (
        <div className="inicio-pag">

            <div className="mapa-container">
                <Mapa hoteles={hoteles} />
            </div>
            <Busqueda />
            <h3>Resultados de Búsqueda</h3>
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

export default BuscarHospedaje;