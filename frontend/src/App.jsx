import InicioSesion from './pages/inicioSesion';
import NavbarNoAuth from './components/NavbarNoAuth';
import NavbarAuth from './components/navBar';
import Inicio from './pages/inicio';
import Register from './pages/Register';
import TraerHoteles from './pages/TraerHoteles';
import { Routes, Route, useNavigate } from 'react-router-dom';


import axios from 'axios';
import { useEffect, useState  } from 'react';

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

 const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate(); // Inicializa useNavigate

        useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        console.log('En el efecto de verificación de token. Token:', token, 'Ruta:', window.location.pathname, 'isAuthenticated:', isAuthenticated);
        if (token) {
            setIsAuthenticated(true);
            console.log('Autenticado.');
        } else {
            if (window.location.pathname !== '/') {
                console.log('No autenticado, redirigiendo a /.');
                navigate('/');
            } else {
                console.log('En /, no redirigiendo.');
            }
        }
    }, [navigate, isAuthenticated]); 
    // Interceptor para agregar el token a todas las solicitudes
    useEffect(() => {
        axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Si recibimos un 401 (No autorizado), limpiar el token y redirigir al inicio de sesión
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    setIsAuthenticated(false);
                    navigate('/');
                }
                return Promise.reject(error);
            }
        );
    }, [navigate]);


return (
  <>
    {isAuthenticated ? <NavbarAuth /> : <NavbarNoAuth />}
    <div className="App">
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buscar" element={<TraerHoteles />} />
      </Routes>
    </div>
  </>
);
}

export default App;