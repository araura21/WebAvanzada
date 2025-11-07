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

  if (loading) return <div><p align="center">Cargando asignaturas...</p></div>;

  return (
    <div>
      {asignaturas.length === 0 ? (
        <p align="center">No hay asignaturas registradas</p>
      ) : (
        <table border="1" cellPadding="8" width="90%" align="center">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Créditos</th>
              <th>Docente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asignaturas.map(asig => (
              <tr key={asig.id}>
                <td>{asig.codigo}</td>
                <td>{asig.nombre}</td>
                <td>{asig.creditos}</td>
                <td>{asig.Docente ? asig.Docente.nombre : (asig.docenteId || 'Sin asignar')}</td>
                <td>
                  <button onClick={() => onEdit(asig)} title="Editar">Editar</button>
                  <button onClick={() => handleDelete(asig.id)} title="Eliminar">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AsignaturaList;
