// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/navBar.css';

function Navbar() {
  const location = useLocation();
  
  // Lista de enlaces para la navegación
  const navItems = [
    { path: '/reservas', label: 'Reservas', icon: '📅' },
    { path: '/habitaciones', label: 'Habitaciones', icon: '🛏️' },
    { path: '/servicios', label: 'Servicios', icon: '🍽️' },
    { path: '/perfil', label: 'Mi Perfil', icon: '👤' }
  ];

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Link to="/" className="logo-link">
        <div className="logo">
          <span className="logo-icon">🏨</span>
          <span className="logo-text">Plataforma de Hospedaje</span>
        </div>
      </Link>
      
      <ul className="nav-links">
        {navItems.map((item) => (
          <li 
            key={item.path} 
            className={location.pathname === item.path ? 'active' : ''}
          >
            <Link to={item.path}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}

export default Navbar;