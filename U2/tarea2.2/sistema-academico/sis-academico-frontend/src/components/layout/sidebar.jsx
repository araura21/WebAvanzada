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
                  <i className="bi bi-people-fill"></i> Usuarios
                </Link>
              </li>
              <li>
                <Link to="/admin/estudiantes" className={isActive('/admin/estudiantes')}>
                  <i className="bi bi-person-badge"></i> Estudiantes
                </Link>
              </li>
              <li>
                <Link to="/admin/docentes" className={isActive('/admin/docentes')}>
                  <i className="bi bi-person-video3"></i> Docentes
                </Link>
              </li>
              <li>
                <Link to="/admin/asignaturas" className={isActive('/admin/asignaturas')}>
                  <i className="bi bi-book"></i> Asignaturas
                </Link>
              </li>
              <li>
                <Link to="/admin/matriculas" className={isActive('/admin/matriculas')}>
                  <i className="bi bi-card-checklist"></i> Matrículas
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
                <Link to="/docente/clases" className={isActive('/docente/clases')}>
                  <i className="bi bi-journal-check"></i> Mis Clases / Calificar
                </Link>
              </li>
              <li>
                <Link to="/docente/resumen" className={isActive('/docente/resumen')}>
                  <i className="bi bi-table"></i> Resumen de Notas
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
              {/* <li>
                <Link to="/estudiante/companeros" className={isActive('/estudiante/companeros')}>
                  <i className="bi bi-people"></i> Mis Compañeros
                </Link>
              </li> */}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
