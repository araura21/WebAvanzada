import React, { useState, useEffect } from 'react';
import asignaturaService from '../../services/asignaturaServices.js';

const AsignaturaList = ({ onEdit, onDelete }) => {
  // estado para almacenar la lista de asignaturas
  const [asignaturas, setAsignaturas] = useState([]);
  // estado para indicar si está cargando
  const [loading, setLoading] = useState(false);

  // cargar asignaturas al montar el componente
  useEffect(() => {
    cargarAsignaturas();
  }, []);

  // función para cargar asignaturas desde el backend
  const cargarAsignaturas = async () => {
    setLoading(true);
    try {
      const data = await asignaturaService.getAll();
      setAsignaturas(data);
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
      alert('Error al cargar asignaturas');
    } finally {
      setLoading(false);
    }
  };

  // función para manejar eliminación
  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta asignatura?')) return;
    
    try {
      await asignaturaService.remove(id);
      alert('Asignatura eliminada correctamente');
      cargarAsignaturas();
      onDelete && onDelete();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar asignatura');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cargando asignaturas...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-gray-700">Código</th>
            <th className="px-4 py-3 text-left text-gray-700">Nombre</th>
            <th className="px-4 py-3 text-left text-gray-700">Créditos</th>
            <th className="px-4 py-3 text-left text-gray-700">Docente</th>
            <th className="px-4 py-3 text-center text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaturas.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-8 text-gray-500">
                No hay asignaturas registradas
              </td>
            </tr>
          ) : (
            asignaturas.map((asig) => (
              <tr key={asig.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{asig.codigo}</td>
                <td className="px-4 py-3 font-medium">{asig.nombre}</td>
                <td className="px-4 py-3">{asig.creditos}</td>
                <td className="px-4 py-3">
                  {asig.Docente ? asig.Docente.nombre : (asig.docenteId || 'Sin asignar')}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit(asig)}
                    className="text-blue-600 hover:text-blue-800 mx-2"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(asig.id)}
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

export default AsignaturaList;
