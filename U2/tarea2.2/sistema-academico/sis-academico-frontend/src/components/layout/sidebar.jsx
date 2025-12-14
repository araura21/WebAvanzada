import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const rol = localStorage.getItem('rol');
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Sistema Académico</h2>
        <small className="text-muted">{rol ? rol.toUpperCase() : 'Guest'}</small>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {rol === 'admin' && (
            <>
              <li>
                <Link to="/dashboard" className={isActive('/dashboard')}>
                  <i className="bi bi-house-door"></i> Inicio
                </Link>
              </li>
              <li>
                <Link to="/admin/usuarios" className={isActive('/admin/usuarios')}>
                  <i className="bi bi-people"></i> Usuarios
                </Link>
              </li>
              <li>
                <Link to="/admin/asignaturas" className={isActive('/admin/asignaturas')}>
                  <i className="bi bi-book"></i> Asignaturas
                </Link>
              </li>
              <li>
                <Link to="/admin/logs" className={isActive('/admin/logs')}>
                  <i className="bi bi-shield-lock"></i> Auditoría
                </Link>
              </li>
            </>
          )}

          {rol === 'docente' && (
            <>
              <li>
                <Link to="/docente/dashboard" className={isActive('/docente/dashboard')}>
                  <i className="bi bi-house-door"></i> Inicio
                </Link>
              </li>
              <li>
                <Link to="/docente/estudiantes" className={isActive('/docente/estudiantes')}>
                  <i className="bi bi-people"></i> Mis Estudiantes
                </Link>
              </li>
              <li>
                <Link to="/docente/notas" className={isActive('/docente/notas')}>
                  <i className="bi bi-journal-text"></i> Notas
                </Link>
              </li>
              <li>
                <Link to="/docente/matriculas" className={isActive('/docente/matriculas')}>
                  <i className="bi bi-pencil-square"></i> Matricular
                </Link>
              </li>
            </>
          )}

          {rol === 'estudiante' && (
            <>
              <li>
                <Link to="/estudiante/dashboard" className={isActive('/estudiante/dashboard')}>
                  <i className="bi bi-house-door"></i> Inicio
                </Link>
              </li>
              <li>
                <Link to="/estudiante/notas" className={isActive('/estudiante/notas')}>
                  <i className="bi bi-bar-chart"></i> Mis Notas
                </Link>
              </li>
              <li>
                <Link to="/estudiante/perfil" className={isActive('/estudiante/perfil')}>
                  <i className="bi bi-person-badge"></i> Mi Perfil
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
