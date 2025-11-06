import React, { useState, useEffect } from 'react';
import estudianteService from '../../services/estudianteServices.js';

const EstudianteList = ({ onEdit, onDelete }) => {
  // estado para almacenar la lista de estudiantes
  const [estudiantes, setEstudiantes] = useState([]);
  // estado para indicar si está cargando
  const [loading, setLoading] = useState(false);

  // cargar estudiantes al montar el componente
  useEffect(() => {
    cargarEstudiantes();
  }, []);

  // función para cargar estudiantes desde el backend
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

  // función para manejar eliminación
  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este estudiante?')) return;
    
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cargando estudiantes...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-gray-700">ID</th>
            <th className="px-4 py-3 text-left text-gray-700">Nombre</th>
            <th className="px-4 py-3 text-left text-gray-700">Carrera</th>
            <th className="px-4 py-3 text-center text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-8 text-gray-500">
                No hay estudiantes registrados
              </td>
            </tr>
          ) : (
            estudiantes.map((est) => (
              <tr key={est.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{est.id}</td>
                <td className="px-4 py-3 font-medium">{est.nombre}</td>
                <td className="px-4 py-3">{est.carrera}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit(est)}
                    className="text-blue-600 hover:text-blue-800 mx-2"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(est.id)}
                    className="text-red-600 hover:text-red-800 mx-2"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EstudianteList;
