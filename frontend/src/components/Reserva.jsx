// HotelSearch.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../assets/playa.jpg';
import '../styles/Reserva.css';

const HotelSearch = () => {
  const [destination, setDestination] = useState('');
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  // Referencia para el modal de huéspedes
  const guestPickerRef = useRef(null);

  // Estado para los huéspedes y habitaciones
  const [rooms, setRooms] = useState([
    { id: 1, adults: 2, children: 0 },
    { id: 2, adults: 1, children: 0 }
  ]);

  // Calcula el total de huéspedes y habitaciones
  const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);
  const totalPeople = totalAdults + totalChildren;
  const guestsDisplay = `${totalPeople} ${totalPeople === 1 ? 'persona' : 'personas'}, ${rooms.length} ${rooms.length === 1 ? 'habitación' : 'habitaciones'}`;

  useEffect(() => {
    // Cerrar el modal de huéspedes al hacer clic fuera de él
    function handleClickOutside(event) {
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target) &&
        !event.target.closest('.guests-input')) {
        setShowGuestPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Búsqueda con:', {
      destination,
      rooms
    });
  };

  const handleAddRoom = () => {
    setRooms([...rooms, { id: rooms.length + 1, adults: 1, children: 0 }]);
  };

  const handleRemoveRoom = (id) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(room => room.id !== id));
    }
  };

  const updateRoomGuests = (id, type, operation) => {
    setRooms(rooms.map(room => {
      if (room.id === id) {
        const newValue = operation === 'add'
          ? room[type] + 1
          : Math.max(0, room[type] - 1);

        // Si es adults, asegurarnos que siempre hay al menos 1
        if (type === 'adults' && operation === 'subtract') {
          return { ...room, adults: Math.max(1, room.adults - 1) };
        }

        return { ...room, [type]: newValue };
      }
      return room;
    }));
  };

  return (
    <div className="search-container">
      <div className="banner-content">
        <h1 className="search-title">¿A dónde quieres ir?</h1>
      </div>

      <div className="search-bar-wrapper">
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-input-group">
            <div className="input-icon">
              <i className="location-icon"></i>
            </div>
            <input
              type="text"
              placeholder="¿Adónde quieres ir?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="search-input destination-input"
            />
          </div>

          <div className="search-input-group guests-group">
            <div className="input-icon">
              <i className="guests-icon"></i>
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

            {showGuestPicker && (
              <div className="guest-picker-modal" ref={guestPickerRef}>
                {rooms.map((room) => (
                  <div key={room.id} className="room-selection">
                    <h3>Habitación {room.id}</h3>

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

                    <button
                      type="button"
                      className="remove-room-button"
                      onClick={() => handleRemoveRoom(room.id)}
                    >
                      Eliminar habitación
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-room-button"
                  onClick={handleAddRoom}
                >
                  Agregar otra habitación
                </button>

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
  );
};

export default HotelSearch;