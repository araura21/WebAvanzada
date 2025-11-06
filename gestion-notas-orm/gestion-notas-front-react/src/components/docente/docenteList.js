import React, { useState, useEffect } from 'react';
import docenteService from '../../services/docenteServices.js';

const DocenteList = ({ onEdit, onDelete }) => {
  // estado para almacenar la lista de docentes
  const [docentes, setDocentes] = useState([]);
  // estado para indicar si está cargando
  const [loading, setLoading] = useState(false);

  // cargar docentes al montar el componente
  useEffect(() => {
    cargarDocentes();
  }, []);

  // función para cargar docentes desde el backend
  const cargarDocentes = async () => {
    setLoading(true);
    try {
      const data = await docenteService.getAll();
      setDocentes(data);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
      alert('Error al cargar docentes');
    } finally {
      setLoading(false);
    }
  };

  // función para manejar eliminación
  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este docente?')) return;
    
    try {
      await docenteService.remove(id);
      alert('Docente eliminado correctamente');
      cargarDocentes();
      onDelete && onDelete();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar docente');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cargando docentes...</p>
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
            <th className="px-4 py-3 text-left text-gray-700">Departamento</th>
            <th className="px-4 py-3 text-center text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-8 text-gray-500">
                No hay docentes registrados
              </td>
            </tr>
          ) : (
            docentes.map((doc) => (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{doc.id}</td>
                <td className="px-4 py-3 font-medium">{doc.nombre}</td>
                <td className="px-4 py-3">{doc.departamento}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit(doc)}
                    className="text-blue-600 hover:text-blue-800 mx-2"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
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

export default DocenteList;
