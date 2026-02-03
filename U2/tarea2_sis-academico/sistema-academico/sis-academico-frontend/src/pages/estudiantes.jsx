import React from "react";
import EstudianteForm from "../components/estudiantes/estudiante.form.jsx";

const Estudiantes = ({ onLogout }) => {
  const usuario = localStorage.getItem('usuario');
  const rol = localStorage.getItem('rol');

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">Gestión de Estudiantes</h2>
            {usuario && <small className="text-muted">Usuario: {usuario} ({rol || 'sin rol'})</small>}
          </div>
          {onLogout && (
            <button 
              onClick={onLogout}
              className="btn btn-danger btn-sm"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <EstudianteForm />
        </div>
      </div>
    </div>
  );
};

export default Estudiantes;
