import React from "react";
import EstudianteForm from "../components/estudiantes/estudiante.form.jsx";

const Estudiantes = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Gestión de Estudiantes</h2>
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
