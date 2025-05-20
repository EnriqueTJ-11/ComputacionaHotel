// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/navBar.css';

function NavbarAuth({ handleLogout }) {
  const location = useLocation();

  // Lista de enlaces para la navegación
  const navItems = [
    { path: '/hospedaje', label: 'Buscar Hospedaje', icon: '🛏️' },
    { path: '/perfil', label: 'Mi Perfil', icon: '👤' },
    { path: '/registerHospedaje', label: 'Registrar Hospedaje', icon: '+' },
    { path: '/', label: 'Cerrar Sesión', icon: '🔗', onClick: handleLogout } // Usamos onClick directamente
  ];

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Link to="/inicio" className="logo-link">
        <div className="logo">
          <span className="logo-text">Plataforma de Hospedaje</span>
        </div>
      </Link>

      <ul className="nav-links">
        {navItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            {item.onClick ? ( // Si el item tiene un onClick, usa un botón
              <button onClick={item.onClick} className="nav-link-button">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </button>
            ) : ( // Si no tiene onClick, usa un Link
              <Link to={item.path}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}

export default NavbarAuth;