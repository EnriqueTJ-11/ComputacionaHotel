import InicioSesion from './pages/inicioSesion';
import NavbarNoAuth from './components/NavbarNoAuth';
import Inicio from './pages/inicio';
import Register from './pages/Register';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    axios.get('http://localhost:8000/variables/')
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
          <Route path="/" element={<Inicio />} /> 
          <Route path="/inicioSesion" element={<InicioSesion />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;