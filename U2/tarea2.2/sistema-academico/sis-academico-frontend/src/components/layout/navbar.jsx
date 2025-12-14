import React from 'react';
import './navbar.css';

const Navbar = ({ onLogout }) => {
  const usuario = localStorage.getItem('usuario');
  const rol = localStorage.getItem('rol');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <span className="navbar-title">Bienvenido</span>
          <div className="navbar-user">
            <span className="user-info">
              {usuario} ({rol})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
