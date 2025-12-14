import React, { useState } from "react";
import { crearEstudiante } from "../../services/estudiante.service";

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
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "foto") {
      setForm({ ...form, foto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("cedula", form.cedula);
      formData.append("nombres", form.nombres);
      formData.append("apellidos", form.apellidos);
      formData.append("correo", form.correo);
      formData.append("telefono", form.telefono);
      formData.append("curso", form.curso);
      formData.append("paralelo", form.paralelo);
      if (form.foto) {
        formData.append("foto", form.foto);
      }

      const resultado = await crearEstudiante(formData);
      console.log("Respuesta del servidor:", resultado);
      
      if (resultado.id) {
        setMensaje("Estudiante registrado exitosamente");
        setForm({
          cedula: "",
          nombres: "",
          apellidos: "",
          correo: "",
          telefono: "",
          curso: "",
          paralelo: "",
          foto: null,
        });
      } else {
        setError(resultado.mensaje || "Error al registrar estudiante");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">

      <h3>Registrar Estudiante</h3>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label>Cédula</label>
        <input type="text" name="cedula" className="form-control" maxLength={10}
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
        <input type="text" name="telefono" className="form-control" maxLength={10}
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
