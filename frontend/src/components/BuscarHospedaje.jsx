// src/components/BuscarHospedaje.jsx
import React, { useState } from 'react';
import '../styles/InicioPag.css'; // Importa los estilos CSS
import Busqueda from '../components/Reserva'; // Asegúrate de que la ruta sea correcta
import Mapa from '../components/HospedajeMapa'; // Asegúrate de que la ruta sea correcta
 // Asegúrate de que la ruta sea correcta

// El componente ahora recibe 'hoteles' como prop
function BuscarHospedaje({ hoteles }) {
    return (
        <div className="inicio-pag">
            
            <div className="mapa-container">
                <Mapa hoteles={hoteles}/>
            </div>
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
                            <p>Longitud: {hotel.longitud}</p>

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