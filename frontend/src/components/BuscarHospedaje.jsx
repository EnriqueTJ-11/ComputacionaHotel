// src/components/BuscarHospedaje.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/InicioPag.css';
import Mapa from '../components/HospedajeMapa'; // Asegúrate de que la ruta sea correcta
import Reserva from '../components/Reserva'; // Renombrado a Reserva para claridad
import imagen from '../assets/hotel.jpg'; // Asegúrate de que la ruta sea correcta


// Define la URL base de tu backend (si la necesitas para obtener todos los hoteles)
const API_BASE_URL = 'http://localhost:3000/api/ontologia'; // Asegúrate de que esta URL sea correcta

function BuscarHospedaje() {
    const [allHoteles, setAllHoteles] = useState([]); // Para almacenar todos los hoteles
    const [hospedajesMostrados, setHospedajesMostrados] = useState([]); // Hoteles que se mostrarán
    const [busquedaRealizada, setBusquedaRealizada] = useState(false); // Indica si se hizo una búsqueda
    const [isLoadingAllHoteles, setIsLoadingAllHoteles] = useState(true); // Estado de carga inicial

    // Efecto para cargar todos los hoteles al inicio
    useEffect(() => {
        const fetchAllHoteles = async () => {
            try {
                // Aquí deberías tener un endpoint en tu backend que devuelva TODOS los alojamientos
                // Si no lo tienes, puedes adaptarlo para una consulta muy general o crear uno nuevo.
                // Por ejemplo, un endpoint '/alojamientos' que no reciba parámetros de búsqueda.
                const response = await axios.get(`${API_BASE_URL}/query`, {
                    params: {
                        sparqlQuery: `
                            PREFIX : <http://www.semanticweb.org/ontologies/hotel#>
                            SELECT ?id_alojamiento ?nombre ?descripcion ?capacidad ?categoria ?latitud ?longitud ?ciudad
                            WHERE {
                                ?alojamiento a :Alojamiento .
                                OPTIONAL { ?alojamiento :id_alojamiento ?id_alojamiento . }
                                OPTIONAL { ?alojamiento :nombre ?nombre . }
                                OPTIONAL { ?alojamiento :descripcion ?descripcion . }
                                OPTIONAL { ?alojamiento :capacidadTotal ?capacidad . }
                                OPTIONAL { ?alojamiento :tieneTipoAlojamiento ?tipoAlojamiento .
                                           ?tipoAlojamiento :categoria ?categoria . }
                                OPTIONAL { ?alojamiento :ubicadoEn ?ciudadRecurso .
                                           ?ciudadRecurso :nombreCiudad ?ciudad . }
                                OPTIONAL { ?alojamiento :latitud ?latitud . }
                                OPTIONAL { ?alojamiento :longitud ?longitud . }
                            }
                        `
                    }
                });

                if (response.data && response.data.success) {
                    const mappedHoteles = response.data.data.map(item => ({
                        id_alojamiento: item.id_alojamiento,
                        nombre: item.nombre || 'Sin nombre',
                        descripcion: item.descripcion || 'Sin descripción',
                        capacidad: item.capacidad || 'N/A',
                        categoria: item.categoria || 'N/A',
                        latitud: item.latitud,
                        longitud: item.longitud,
                        ciudad: item.ciudad || 'N/A',
                    }));
                    setAllHoteles(mappedHoteles);
                    setHospedajesMostrados(mappedHoteles); // Inicialmente muestra todos
                    console.log("Todos los hoteles cargados:", mappedHoteles);
                } else {
                    console.error("Error al cargar todos los hoteles:", response.data);
                    setAllHoteles([]);
                    setHospedajesMostrados([]);
                }
            } catch (error) {
                console.error('Error al obtener todos los hoteles:', error);
                setAllHoteles([]);
                setHospedajesMostrados([]);
            } finally {
                setIsLoadingAllHoteles(false);
            }
        };

        fetchAllHoteles();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

    // Función que se pasa a Reserva para actualizar los resultados de búsqueda
    const handleSearchResults = (results) => {
        setHospedajesMostrados(results); // Establece los resultados de la búsqueda
    };

    // Función para saber si se realizó una búsqueda o si es la carga inicial
    const handleSearchPerformed = (performed) => {
        setBusquedaRealizada(performed);
    };

    // Determina qué título mostrar
    const getResultsTitle = () => {
        if (busquedaRealizada) {
            return "Resultados de Búsqueda";
        }
        return "Todos los Hospedajes Disponibles";
    };

    return (
        <div className="inicio-pag">
            <div className="mapa-container">
                <Mapa hoteles={hospedajesMostrados} />
            </div>

            <Reserva
                onSearchResults={handleSearchResults}
                onSearchPerformed={handleSearchPerformed}
            />

            <h3>{getResultsTitle()}</h3>
            <div className="contenedor-hoteles">
                {isLoadingAllHoteles ? (
                    <p>Cargando todos los hospedajes...</p>
                ) : (
                    hospedajesMostrados.length > 0 ? (
                        hospedajesMostrados.map((hotel) => (
                            <div key={hotel.id_alojamiento} className="hotel-container"> {/* Asegúrate de que id_alojamiento sea único */}
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
                            {busquedaRealizada
                                ? "No se encontraron hoteles con los criterios especificados."
                                : "No hay hospedajes disponibles en este momento."}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default BuscarHospedaje;