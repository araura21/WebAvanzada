import React, { useState, useEffect } from 'react';
import notaService from '../../services/notaServices.js';

const NotaList = ({ onEdit, onDelete }) => {
  // estado para almacenar la lista de notas
  const [notas, setNotas] = useState([]);
  // estado para indicar si está cargando
  const [loading, setLoading] = useState(false);

  // cargar notas al montar el componente
  useEffect(() => {
    cargarNotas();
  }, []);

  // función para cargar notas desde el backend
  const cargarNotas = async () => {
    setLoading(true);
    try {
      const data = await notaService.getAll();
      setNotas(data);
    } catch (error) {
      console.error('Error al cargar notas:', error);
      alert('Error al cargar notas');
    } finally {
      setLoading(false);
    }
  };

  // función para manejar eliminación
  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta nota?')) return;
    
    try {
      await notaService.remove(id);
      alert('Nota eliminada correctamente');
      cargarNotas();
      onDelete && onDelete();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar nota');
    }
  };

  // función para obtener el nombre del estudiante
  const getEstudianteNombre = (nota) => {
    return nota.Estudiante?.nombre || 'N/A';
  };

  // función para obtener el nombre de la asignatura
  const getAsignaturaNombre = (nota) => {
    return nota.Asignatura?.nombre || 'N/A';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cargando notas...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-gray-700">Estudiante</th>
            <th className="px-4 py-3 text-left text-gray-700">Asignatura</th>
            <th className="px-4 py-3 text-center text-gray-700">Nota 1</th>
            <th className="px-4 py-3 text-center text-gray-700">Nota 2</th>
            <th className="px-4 py-3 text-center text-gray-700">Nota 3</th>
            <th className="px-4 py-3 text-center text-gray-700">Promedio</th>
            <th className="px-4 py-3 text-center text-gray-700">Categoría</th>
            <th className="px-4 py-3 text-center text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-8 text-gray-500">
                No hay notas registradas
              </td>
            </tr>
          ) : (
            notas.map((nota) => (
              <tr key={nota.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{getEstudianteNombre(nota)}</td>
                <td className="px-4 py-3">{getAsignaturaNombre(nota)}</td>
                <td className="px-4 py-3 text-center">{nota.nota1?.toFixed(1)}</td>
                <td className="px-4 py-3 text-center">{nota.nota2?.toFixed(1)}</td>
                <td className="px-4 py-3 text-center">{nota.nota3?.toFixed(1)}</td>
                <td className="px-4 py-3 text-center font-bold">{nota.promedio?.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    nota.promedio >= 14 ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {nota.categoria}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit(nota)}
                    className="text-blue-600 hover:text-blue-800 mx-2"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(nota.id)}
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

export default NotaList;
