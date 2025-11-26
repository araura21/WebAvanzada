import React, { useState, useEffect } from 'react';
import estudianteService from '../../services/estudianteServices.js';

const EstudianteForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ nombre: '', carrera: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ nombre: initialData.nombre || '', carrera: initialData.carrera || '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (initialData) {
      setFormData({ nombre: initialData.nombre || '', carrera: initialData.carrera || '' });
    } else {
      setFormData({ nombre: '', carrera: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.carrera.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }

    setSaving(true);
    try {
      if (initialData) {
        await estudianteService.update(initialData.id, formData);
      } else {
        await estudianteService.create(formData);
      }
      onSave && onSave();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar: ' + (error.message || error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div align="center">
        <h3 align="center">Formulario de ingreso de estudiantes</h3>
        <table align="center" cellPadding="6">
          <tbody>
            <tr>
              <td><label htmlFor="nombre">Nombre completo:</label></td>
              <td>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  required
                  size="40"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="carrera">Carrera:</label></td>
              <td>
                <input
                  id="carrera"
                  type="text"
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleChange}
                  placeholder="Ej: Ingeniería de Sistemas"
                  required
                  size="40"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <button type="button" onClick={handleReset} disabled={saving}>Cancelar</button>
          &nbsp;
          <button type="submit" disabled={saving}>{saving ? 'Guardando...' : (initialData ? 'Actualizar' : 'Guardar')}</button>
        </div>

        <div>
          <button type="button" onClick={onCancel}>Cerrar</button>
        </div>
      </div>
    </form>
  );
};

export default EstudianteForm;
