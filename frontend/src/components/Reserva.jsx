// src/components/Reserva.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/Reserva.css';

// Define la URL base de tu backend
const API_BASE_URL = 'http://localhost:3000/api/ontologia';

// Elimina el componente HospedajeCard de aquí, ya no es necesario.

// Modifica el componente Reserva para aceptar props para actualizar los resultados
function Reserva({ onSearchResults, onSearchPerformed }) { // Acepta nuevas props
    const [destination, setDestination] = useState('');
    const [showGuestPicker, setShowGuestPicker] = useState(false);

    // Estados para el autocompletar de ciudades
    const [ciudadesSugeridas, setCiudadesSugeridas] = useState([]);
    const [todasLasCiudades, setTodasLasCiudades] = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

    // Los estados hospedajesEncontrados y busquedaRealizada YA NO SE MANEJAN AQUÍ.
    // Ahora se pasarán al componente padre mediante las funciones de callback.
    // Eliminado: const [hospedajesEncontrados, setHospedajesEncontrados] = useState([]);
    // Eliminado: const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    // Referencias para el modal de huéspedes y el input de destino
    const guestPickerRef = useRef(null);
    const destinationInputRef = useRef(null);

    // Estado para los huéspedes y habitaciones
    const [rooms, setRooms] = useState([
        { id: 1, adults: 2, children: 0 },
        { id: 2, adults: 1, children: 0 }
    ]);

    // Calcula el total de huéspedes y habitaciones para mostrar en el input
    const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);
    const totalPeople = totalAdults + totalChildren;
    const totalRooms = rooms.length;
    const guestsDisplay = `${totalPeople} ${totalPeople === 1 ? 'persona' : 'personas'}, ${totalRooms} ${totalRooms === 1 ? 'habitación' : 'habitaciones'}`;

    // Efecto para cerrar el selector de huéspedes y las sugerencias de ciudad al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (guestPickerRef.current && !guestPickerRef.current.contains(event.target) &&
                !event.target.closest('.guests-input')) {
                setShowGuestPicker(false);
            }
            if (destinationInputRef.current && !destinationInputRef.current.contains(event.target) &&
                !event.target.closest('.sugerencias-dropdown')) {
                setMostrarSugerencias(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Efecto para obtener todas las ciudades de tu API al cargar el componente
    useEffect(() => {
        const fetchCiudades = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/traerCiudades`);
                if (response.data && response.data.success) {
                    setTodasLasCiudades(response.data.data);
                    console.log("Ciudades cargadas:", response.data.data);
                } else {
                    console.error("Error al cargar ciudades:", response.data);
                }
            } catch (error) {
                console.error('Error al obtener ciudades para autocompletado:', error);
            }
        };
        fetchCiudades();
    }, []);

    // Función para añadir una nueva habitación al selector de huéspedes
    const handleAddRoom = () => {
        setRooms([...rooms, { id: rooms.length + 1, adults: 1, children: 0 }]);
    };

    // Función para eliminar una habitación del selector de huéspedes (mínimo una habitación)
    const handleRemoveRoom = (id) => {
        if (rooms.length > 1) {
            setRooms(rooms.filter(room => room.id !== id));
        }
    };

    // Función para actualizar la cantidad de adultos/niños en una habitación específica
    const updateRoomGuests = (id, type, operation) => {
        setRooms(rooms.map(room => {
            if (room.id === id) {
                if (type === 'adults') {
                    const newAdults = operation === 'add' ? room.adults + 1 : Math.max(1, room.adults - 1);
                    return { ...room, adults: newAdults };
                }
                if (type === 'children') {
                    const newChildren = operation === 'add' ? room.children + 1 : Math.max(0, room.children - 1);
                    return { ...room, children: newChildren };
                }
            }
            return room;
        }));
    };

    // Maneja el cambio en el input de destino y filtra las sugerencias
    const handleDestinationChange = (e) => {
        const valor = e.target.value;
        setDestination(valor);

        if (valor.length > 0) {
            const sugerenciasFiltradas = todasLasCiudades.filter(ciudad =>
                ciudad.toLowerCase().includes(valor.toLowerCase())
            );
            setCiudadesSugeridas(sugerenciasFiltradas);
            setMostrarSugerencias(true);
        } else {
            setCiudadesSugeridas([]);
            setMostrarSugerencias(false);
        }
    };

    // Cuando se hace clic en una sugerencia, se establece como destino y se ocultan las sugerencias
    const handleSugerenciaClick = (ciudad) => {
        setDestination(ciudad);
        setCiudadesSugeridas([]);
        setMostrarSugerencias(false);
    };

    // Función principal para manejar la búsqueda de hospedajes
    const handleSearch = async (e) => {
        e.preventDefault();
        onSearchPerformed(true); // Informa al padre que se realizó una búsqueda
        setIsLoading(true); // Mostrar indicador de carga

        try {
            const maxPersonasPorHabitacion = rooms.reduce((max, room) => {
                const personasEnHabitacion = room.adults + room.children;
                return personasEnHabitacion > max ? personasEnHabitacion : max;
            }, 0);

            const params = {};
            
            if (destination && destination.trim() !== '') {
                params.destino = destination.trim();
            }
            
            if (totalPeople > 0) {
                params.personas = totalPeople;
            }
            
            if (maxPersonasPorHabitacion > 0) {
                params.habitaciones = maxPersonasPorHabitacion;
            }

            console.log("Enviando búsqueda con parámetros:", params);

            const response = await axios.get(`${API_BASE_URL}/buscar`, { params });

            console.log("Respuesta del backend:", response.data);

            if (response.data && response.data.success) {
                const formattedResults = response.data.data.map(item => ({
                    id_alojamiento: item.id_alojamiento,
                    nombre: item.nombre || 'Sin nombre',
                    capacidad: item.capacidad,
                    categoria: item.categoria,
                    descripcion: item.descripcion,
                    latitud: item.latitud,
                    longitud: item.longitud,
                    ciudad: item.ciudad,
                    capacidadHabitacion: item.capacidadHabitacion,
                    numeroCamas: item.numeroCamas,
                }));
                
                onSearchResults(formattedResults); // Envía los resultados al padre
                setShowGuestPicker(false);
                console.log("Resultados procesados:", formattedResults);
            } else {
                console.error("Respuesta de búsqueda no exitosa:", response.data);
                onSearchResults([]); // Envía un array vacío al padre
            }
        } catch (error) {
            console.error('Error al buscar hospedajes:', error);
            onSearchResults([]); // Envía un array vacío al padre
        } finally {
            setIsLoading(false); // Ocultar indicador de carga
        }
    };

    return (
        <div className="search-page-container">
            {/* Sección del banner con el formulario de búsqueda */}
            <div className="banner-section">
                <img src="/src/assets/playa.jpg" alt="Fondo de playa" className="banner-image" />
                <div className="banner-overlay">
                    <h1 className="search-title">¿A dónde quieres ir?</h1>
                    <div className="search-bar-wrapper">
                        <form className="search-bar" onSubmit={handleSearch}>
                            {/* Grupo de entrada para el destino con autocompletado */}
                            <div className="search-input-group" ref={destinationInputRef}>
                                <div className="input-icon">
                                    <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <input
                                    type="text"
                                    placeholder="¿Adónde quieres ir?"
                                    value={destination}
                                    onChange={handleDestinationChange}
                                    onFocus={() => destination.length > 0 && setMostrarSugerencias(true)}
                                    className="search-input destination-input"
                                    autoComplete="off"
                                />
                                {mostrarSugerencias && ciudadesSugeridas.length > 0 && (
                                    <ul className="sugerencias-dropdown">
                                        {ciudadesSugeridas.map((ciudad, index) => (
                                            <li key={index} onClick={() => handleSugerenciaClick(ciudad)}>
                                                {ciudad}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Grupo de entrada para la selección de huéspedes */}
                            <div className="search-input-group guests-group">
                                <div className="input-icon">
                                    <i className="fa-solid fa-user-group"></i>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Huéspedes"
                                    value={guestsDisplay}
                                    readOnly
                                    onClick={() => setShowGuestPicker(!showGuestPicker)}
                                    className="search-input guests-input"
                                />
                                <div className="input-label">Huéspedes</div>

                                {/* Modal/Dropdown para seleccionar huéspedes y habitaciones */}
                                {showGuestPicker && (
                                    <div className="guest-picker-modal" ref={guestPickerRef}>
                                        {rooms.map((room) => (
                                            <div key={room.id} className="room-selection">
                                                <h3>Habitación {room.id}</h3>

                                                {/* Control de adultos */}
                                                <div className="guest-type">
                                                    <span>Adultos</span>
                                                    <div className="guest-count-control">
                                                        <button
                                                            type="button"
                                                            className="guest-button decrease"
                                                            onClick={() => updateRoomGuests(room.id, 'adults', 'subtract')}
                                                            disabled={room.adults <= 1}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="guest-count">{room.adults}</span>
                                                        <button
                                                            type="button"
                                                            className="guest-button increase"
                                                            onClick={() => updateRoomGuests(room.id, 'adults', 'add')}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Control de niños */}
                                                <div className="guest-type">
                                                    <div className="child-label">
                                                        <span>Niños</span>
                                                        <span className="child-age">De 0 a 17 años</span>
                                                    </div>
                                                    <div className="guest-count-control">
                                                        <button
                                                            type="button"
                                                            className="guest-button decrease"
                                                            onClick={() => updateRoomGuests(room.id, 'children', 'subtract')}
                                                            disabled={room.children <= 0}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="guest-count">{room.children}</span>
                                                        <button
                                                            type="button"
                                                            className="guest-button increase"
                                                            onClick={() => updateRoomGuests(room.id, 'children', 'add')}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Botón para eliminar habitación (si hay más de una) */}
                                                {rooms.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="remove-room-button"
                                                        onClick={() => handleRemoveRoom(room.id)}
                                                    >
                                                        Eliminar habitación
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {/* Botón para añadir otra habitación */}
                                        <button
                                            type="button"
                                            className="add-room-button"
                                            onClick={handleAddRoom}
                                        >
                                            Agregar otra habitación
                                        </button>

                                        {/* Botón "Listo" para cerrar el modal de huéspedes */}
                                        <div className="rooms-question">
                                            <button
                                                type="button"
                                                className="ready-button"
                                                onClick={() => setShowGuestPicker(false)}
                                            >
                                                Listo
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="search-button">
                                Buscar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Los resultados de búsqueda ahora se renderizan en BuscarHospedaje.jsx */}
        </div>
    );
}

export default Reserva;