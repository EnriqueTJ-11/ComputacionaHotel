// src/components/BuscarHospedaje.jsx
import React from 'react';
import '../styles/InicioPag.css'; // Importa los estilos CSS
import Busqueda from '../components/Reserva'; // Asegúrate de que la ruta sea correcta

// El componente ahora recibe 'hoteles' como prop
function BuscarHospedaje({ hoteles }) {
    return (
        <div className="inicio-pag">
            <Busqueda />
            <div className="contenedor-hoteles">
                {hoteles.length > 0 ? (
                    hoteles.map((hotel, index) => (
                        <div key={hotel.id_alojamiento || index} className="hotel-container">
                            {/* Aquí usamos los datos del objeto 'hotel' */}
                            <h3>{hotel.nombre}</h3>
                            <p>{hotel.descripcion}</p>
                            <p>Capacidad: {hotel.capacidad}</p>
                            <p>Categoría: {hotel.categoria}</p>
                            <p>Latitud: {hotel.latitud}</p>
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

export default BuscarHospedaje;