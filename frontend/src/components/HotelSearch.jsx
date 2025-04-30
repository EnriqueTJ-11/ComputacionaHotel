// HotelSearch.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../assets/playa.jpg'; 
import '../styles/HotelSearch.css';

const HotelSearch = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  
  // Referencias para los modales
  const datePickerRef = useRef(null);
  const guestPickerRef = useRef(null);
  
  // Estado para los huéspedes y habitaciones
  const [rooms, setRooms] = useState([
    { id: 1, adults: 2, children: 0 },
    { id: 2, adults: 1, children: 0 }
  ]);

  // Formatea las fechas para mostrar
  const formattedDates = startDate && endDate 
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : '';

  // Calcula el total de huéspedes y habitaciones
  const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);
  const totalPeople = totalAdults + totalChildren;
  const guestsDisplay = `${totalPeople} ${totalPeople === 1 ? 'persona' : 'personas'}, ${rooms.length} ${rooms.length === 1 ? 'habitación' : 'habitaciones'}`;

  useEffect(() => {
    // Cerrar los modales al hacer clic fuera de ellos
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target) &&
          !event.target.closest('.date-input')) {
        setShowDatePicker(false);
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target) && 
          !event.target.closest('.guests-input')) {
        setShowGuestPicker(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('es', { month: 'short' });
    return `${day} de ${month}`;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Búsqueda con:', { 
      destination, 
      dates: { startDate, endDate }, 
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

          <div className="search-input-group date-group">
            <div className="input-icon">
              <i className="calendar-icon"></i>
            </div>
            <input 
              type="text" 
              placeholder="Fechas" 
              value={formattedDates || ''}
              readOnly
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="search-input date-input"
            />
            <div className="input-label">Fechas</div>
            
            {showDatePicker && (
              <div className="date-picker-modal" ref={datePickerRef}>
                <div className="date-picker-header">
                  <h3>Selecciona tus fechas</h3>
                </div>
                <div className="date-picker-inputs">
                  <div className="date-input-container">
                    <label>Llegada</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="date-input-container">
                    <label>Salida</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                    />
                  </div>
                </div>
                <div className="date-picker-footer">
                  <button 
                    type="button" 
                    className="date-picker-apply"
                    onClick={() => setShowDatePicker(false)}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
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