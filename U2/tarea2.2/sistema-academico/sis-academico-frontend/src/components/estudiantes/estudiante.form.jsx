import React, { useState } from "react";

const EstudianteForm = () => {
  const [form, setForm] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    curso: "",
    paralelo: "",
    foto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "foto") {
      setForm({ ...form, foto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">

      <h3>Registrar Estudiante</h3>

      <div className="mb-3">
        <label>Cédula</label>
        <input type="text" name="cedula" className="form-control"
          onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Nombres</label>
        <input type="text" name="nombres" className="form-control"
          onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Apellidos</label>
        <input type="text" name="apellidos" className="form-control"
          onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Correo</label>
        <input type="email" name="correo" className="form-control"
          onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Teléfono</label>
        <input type="text" name="telefono" className="form-control"
          onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Curso</label>
        <input type="text" name="curso" className="form-control"
          onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Foto</label>
        <input type="file" name="foto" className="form-control"
          onChange={handleChange} />
      </div>

      <button className="btn btn-primary">Guardar</button>
    </form>
  );
};

export default EstudianteForm;
