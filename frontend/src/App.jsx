import InicioSesion from './pages/inicioSesion';
import NavbarNoAuth from './components/NavbarNoAuth';
import NavbarAuth from './components/navBar';
import Inicio from './pages/inicio';
import Register from './pages/Register';
import TraerHoteles from './pages/TraerHoteles';

import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    axios.get('http://localhost:3000/query-ontologia')
      .then(response => {
        console.log('Respuesta del backend:', response.data);
      })
      .catch(error => {
        console.error('Error al conectar con la API:', error);
      });
  }, []);

  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== '/inicio' ? <NavbarNoAuth /> : <NavbarAuth />}
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buscar" element={<TraerHoteles />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </div>
  );
}

export default App;