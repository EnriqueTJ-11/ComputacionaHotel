import InicioSesion from './pages/inicioSesion';
import NavbarNoAuth from './components/NavbarNoAuth';
import Inicio from './pages/inicio';
import Register from './pages/Register';
import TraerHoteles from './pages/TraerHoteles';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

  return (
    <Router>
      <NavbarNoAuth />
      <div className="App">
        <Routes>
          <Route path="/" element={<InicioSesion />} /> 
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buscar" element={<TraerHoteles />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;