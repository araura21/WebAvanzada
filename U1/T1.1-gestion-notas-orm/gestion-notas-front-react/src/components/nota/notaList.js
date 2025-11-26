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
      <div align="center">
        <p>Cargando notas...</p>
      </div>
    );
  }

  return (
    <div>
      <table border="1" cellPadding="8" width="90%" align="center">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Asignatura</th>
            <th>Nota 1</th>
            <th>Nota 2</th>
            <th>Nota 3</th>
            <th>Promedio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.length === 0 ? (
            <tr>
              <td colSpan="8" align="center">No hay notas registradas</td>
            </tr>
          ) : (
            notas.map((nota) => (
              <tr key={nota.id}>
                <td>{getEstudianteNombre(nota)}</td>
                <td>{getAsignaturaNombre(nota)}</td>
                <td align="center">{nota.nota1?.toFixed(1)}</td>
                <td align="center">{nota.nota2?.toFixed(1)}</td>
                <td align="center">{nota.nota3?.toFixed(1)}</td>
                <td align="center">{nota.promedio?.toFixed(2)}</td>
                <td align="center">{nota.categoria}</td>
                <td align="center">
                  <button onClick={() => onEdit(nota)} title="Editar">Editar</button>
                  &nbsp;
                  <button onClick={() => handleDelete(nota.id)} title="Eliminar">Eliminar</button>
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
