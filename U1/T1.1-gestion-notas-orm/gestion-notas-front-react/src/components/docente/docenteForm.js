import React, { useState, useEffect } from 'react';
import docenteService from '../../services/docenteServices';

const DocenteForm = ({ initialData, onSave, onCancel }) => {
  // estado del formulario con valores iniciales
  const [formData, setFormData] = useState({
    nombre: '',
    departamento: ''
  });
  // estado para indicar si está guardando
  const [saving, setSaving] = useState(false);

  // cargar datos iniciales cuando hay un docente a editar
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        departamento: initialData.departamento || ''
      });
    }
  }, [initialData]);

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
    
    // validar campos
    if (!formData.nombre.trim() || !formData.departamento.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }

    setSaving(true);
    try {
      if (initialData) {
        // modo edición
        await docenteService.update(initialData.id, formData);
      } else {
        // modo creación
        await docenteService.create(formData);
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
        departamento: initialData.departamento || ''
      });
    } else {
      setFormData({ nombre: '', departamento: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div align="center">
        <h3 align="center">Formulario de ingreso de docentes</h3>
        <table align="center" cellPadding="6">
          <tbody>
            <tr>
              <td><label>Nombre completo *</label></td>
              <td>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Dr. Carlos Méndez"
                  required
                  size="50"
                />
              </td>
            </tr>
            <tr>
              <td><label>Departamento *</label></td>
              <td>
                <input
                  type="text"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  placeholder="Ej: Ciencias de la Computación"
                  required
                  size="50"
                />
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

export default DocenteForm;
