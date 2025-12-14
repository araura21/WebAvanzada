import React from 'react';
import './sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Sistema Académico</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/estudiantes">Estudiantes</a></li>
          <li><a href="/docentes">Docentes</a></li>
          <li><a href="/notas">Notas</a></li>
          <li><a href="/ayuda">Ayuda</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
