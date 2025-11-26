import React, { useState, useEffect } from 'react';
import estudianteService from '../../services/estudianteServices.js';

const EstudianteList = ({ onEdit, onDelete }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const data = await estudianteService.getAll();
      setEstudiantes(data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      alert('Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Desea eliminar este estudiante?')) return;

    try {
      await estudianteService.remove(id);
      alert('Estudiante eliminado correctamente');
      cargarEstudiantes();
      onDelete && onDelete();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar estudiante');
    }
  };

  if (loading) return <div><p>Cargando estudiantes...</p></div>;

  return (
    <div>
      {estudiantes.length === 0 ? (
        <p align="center">No hay estudiantes registrados.</p>
      ) : (
        <table border="1" cellPadding="8" width="80%" align="center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Carrera</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map(est => (
              <tr key={est.id}>
                <td>{est.id}</td>
                <td>{est.nombre}</td>
                <td>{est.carrera}</td>
                <td>
                  <button onClick={() => onEdit(est)}>Editar</button>
                  <button onClick={() => handleDelete(est.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EstudianteList;
