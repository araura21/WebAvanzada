import React, { useState, useEffect } from 'react';
import asignaturaService from '../../services/asignaturaServices.js';
import docenteService from '../../services/docenteServices.js';

const AsignaturaForm = ({ initialData, onSave, onCancel }) => {
  // estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    creditos: '',
    docenteId: ''
  });
  // lista de docentes para el select
  const [docentes, setDocentes] = useState([]);
  // estado para indicar si está guardando
  const [saving, setSaving] = useState(false);

  // cargar datos iniciales y docentes
  useEffect(() => {
    cargarDocentes();
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        codigo: initialData.codigo || '',
        creditos: initialData.creditos || '',
        docenteId: initialData.docenteId || ''
      });
    }
  }, [initialData]);

  // cargar lista de docentes para el selector
  const cargarDocentes = async () => {
    try {
      const data = await docenteService.getAll();
      setDocentes(data);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
    }
  };

  // manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // validar campos obligatorios
    if (!formData.nombre.trim() || !formData.codigo.trim() || !formData.creditos) {
      alert('Los campos nombre, código y créditos son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        creditos: parseInt(formData.creditos),
        docenteId: formData.docenteId ? parseInt(formData.docenteId) : null
      };

      if (initialData) {
        // modo edición
        await asignaturaService.update(initialData.id, payload);
      } else {
        // modo creación
        await asignaturaService.create(payload);
      }
      onSave && onSave();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };
  const handleReset = () => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        codigo: initialData.codigo || '',
        creditos: initialData.creditos || '',
        docenteId: initialData.docenteId || ''
      });
    } else {
      setFormData({ nombre: '', codigo: '', creditos: '', docenteId: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div align="center">
        <h3 align="center">Formulario de asignaturas</h3>
        <table align="center" cellPadding="6">
          <tbody>
            <tr>
              <td><label>Nombre de la asignatura: </label></td>
              <td>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: POO"
                  required
                  size="50"
                />
              </td>
            </tr>
            <tr>
              <td><label>Código: </label></td>
              <td>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Ej: POO101"
                  required
                  size="20"
                />
              </td>
            </tr>
            <tr>
              <td><label>Créditos: </label></td>
              <td>
                <input
                  type="number"
                  name="creditos"
                  value={formData.creditos}
                  onChange={handleChange}
                  placeholder="Ej: 4"
                  min="1"
                  required
                  size="5"
                />
              </td>
            </tr>
            <tr>
              <td><label>Docente: </label></td>
              <td>
                <select name="docenteId" value={formData.docenteId} onChange={handleChange}>
                  <option value="">Sin asignar</option>
                  {docentes.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.nombre} - {doc.departamento}</option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <button type="button" onClick={handleReset} disabled={saving}>Cancelar</button>
          &nbsp;
          <button type="submit" disabled={saving}>{saving ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}</button>
        </div>

        <div>
          <button type="button" onClick={onCancel}>Cerrar</button>
        </div>
      </div>
    </form>
  );
};

export default AsignaturaForm;
