import React from 'react';
import './navbar.css';

const Navbar = ({ onLogout }) => {
  const usuario = localStorage.getItem('usuario');
  const rol = localStorage.getItem('rol');

  const handleLogout = () => {
    localStorage.clear(); // Limpiar todo para evitar datos cruzados
    // O si prefieres especificos:
    // localStorage.removeItem('token');
    // localStorage.removeItem('usuario');
    // localStorage.removeItem('rol');
    // localStorage.removeItem('estudianteId');
    // localStorage.removeItem('docenteId');

    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <span className="navbar-title">Bienvenido

          </span>
          <div className="navbar-user">
            <br></br><span className="user-info">
              {usuario} ({rol})
            </span>
            <button onClick={handleLogout} className="logout-btn" style={{ float: 'right' }}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
