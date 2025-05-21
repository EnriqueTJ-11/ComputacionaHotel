// src/components/BuscarHospedaje.jsx
import React from 'react';
import '../styles/InicioPag.css'; 
import Mapa from './HospedajeMapa'; // Asegúrate de que la ruta sea correcta

// Este componente SOLO recibe 'hoteles'
function BuscarHospedaje({ hoteles }) { 
    return (
        <div className="inicio-pag">
            {/* <<-- IMPORTANTE: ELIMINA CUALQUIER FORMULARIO DE BÚSQUEDA QUE PUDIERA ESTAR AQUÍ ANTES */}
            {/* <div className="busqueda-wrapper"> 
                <h2>Encuentra tu Alojamiento Ideal</h2>
                <Busqueda onBuscar={onBuscar} /> 
            </div> 
            */}

            <div className="mapa-container">
                <Mapa hoteles={hoteles}/> 
            </div>
            
            <div className="contenedor-hoteles">
                <h3>Resultados de Búsqueda</h3>
                {hoteles.length > 0 ? (
                    hoteles.map((hotel, index) => (
                        <div key={hotel.id_alojamiento || index} className="hotel-container">
                            {/* ... el resto del JSX para mostrar un hotel ... */}
                            <h3>{hotel.nombre}</h3>
                            <p>Descripción: {hotel.descripcion}</p>
                            <p>Capacidad Total: {hotel.capacidad} personas</p>
                            <p>Categoría: {hotel.categoria}</p>
                            <p>Ubicación: {hotel.ciudad}</p>
                            {hotel.capacidadHabitacion && <p>Capacidad por Habitación: {hotel.capacidadHabitacion}</p>}
                            {hotel.numeroCamas && <p>Camas por Habitación: {hotel.numeroCamas}</p>}
                            <p>Latitud: {hotel.latitud}, Longitud: {hotel.longitud}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-hoteles-message">No se encontraron hoteles con los criterios especificados.</div>
                )}
            </div>
        </div>
    );
}

export default BuscarHospedaje;