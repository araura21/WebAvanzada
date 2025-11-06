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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* campo nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Dr. Carlos Méndez"
            required
          />
        </div>

        {/* campo departamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departamento *
          </label>
          <input
            type="text"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Ciencias de la Computación"
            required
          />
        </div>
      </div>

      {/* botones de acción */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={saving}
        >
          {saving ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}
        </button>
      </div>
    </form>
  );
};

export default DocenteForm;
