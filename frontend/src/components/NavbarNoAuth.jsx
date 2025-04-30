// src/components/NavbarNoAuth.jsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/navBar.css'; // Reutilizamos los estilos

function NavbarNoAuth() {
    const location = useLocation();
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Link to="/" className="logo-link">
        <div className="logo">
          <span className="logo-text">Plataforma de Hospedaje</span>
        </div>
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/buscar">
            <span className="nav-text">Buscar Hoteles</span>
          </Link>
        </li>
        <li >
          <Link to="/acerca-de">
            <span className="nav-text">Acerca de</span>
          </Link>
        </li>
        <li className={location.pathname === '/register' ? 'blinking-login' : ''}>
          <Link to="/register">
            <span className="nav-text">Registrar Hotel</span>
          </Link>
          
        </li>
        <li className={location.pathname === '/inicioSesion' ? 'blinking-login' : ''}>
          <Link to="/inicioSesion">
            <span className="nav-text">Iniciar Sesión</span>
          </Link>
        </li>
      </ul>
    </motion.nav>
  );
}

export default NavbarNoAuth;