import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // ¡Importante! CSS de Leaflet
import L from 'leaflet'; // Importa el objeto Leaflet

// Importa las imágenes de los marcadores de Leaflet (para que se vean bien)
// Esto soluciona el problema de los marcadores rotos en Webpack/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


function HotelesMapa({ hoteles }) {
  // Establece una posición central inicial para el mapa.
  // Podría ser el centro de tu área de interés, por ejemplo, Florencia, Caquetá
  const defaultCenter = [1.6148, -75.6062]; // Latitud y Longitud de Florencia, Caquetá

  // Verifica que 'hoteles' sea un array antes de usarlo
  if (!hoteles || !Array.isArray(hoteles)) {
    return <p>No hay datos de hoteles para mostrar en el mapa.</p>;
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13} // Nivel de zoom inicial (ajusta según necesites)
      scrollWheelZoom={false} // Puedes cambiar a true si quieres zoom con la rueda del ratón
      style={{ height: '600px', width: '100%' }} // Estilo para el tamaño del mapa
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {hoteles.map((hotel) => {
        // Asegúrate de que latitud y longitud existan y sean números válidos
        const lat = parseFloat(hotel.latitud);
        const lng = parseFloat(hotel.longitud);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Hotel ${hotel.nombre_alojamiento} tiene lat/lng inválidas:`, hotel.latitud, hotel.longitud);
          return null; // No renderiza el marcador si las coordenadas no son válidas
        }

        return (
          <Marker key={hotel.id_alojamiento} position={[lat, lng]}>
            <Popup>
              <div>
                <h3>{hotel.nombre_alojamiento}</h3>
                <p>{hotel.descripcion}</p>
                <p>Capacidad: {hotel.capacidad_total}</p>
                <p>Categoría: {hotel.categoria}</p>
                {/* Agrega más información que quieras mostrar en el popup */}
                {/* Puedes añadir un Link para ver más detalles */}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default HotelesMapa;