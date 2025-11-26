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
      <div align="center">
        <p>Cargando docentes...</p>
      </div>
    );
  }

  return (
    <div>
      <table border="1" cellPadding="8" width="80%" align="center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.length === 0 ? (
            <tr>
              <td colSpan="4" align="center">No hay docentes registrados</td>
            </tr>
          ) : (
            docentes.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.nombre}</td>
                <td>{doc.departamento}</td>
                <td align="center">
                  <button onClick={() => onEdit(doc)} title="Editar">Editar</button>
                  &nbsp;
                  <button onClick={() => handleDelete(doc.id)} title="Eliminar">Eliminar</button>
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
