import React, { useState, useEffect } from 'react';
import estudianteService from '../../services/estudianteServices.js';

const EstudianteForm = ({ initialData, onSave, onCancel }) => {
  // estado del formulario con valores iniciales
  const [formData, setFormData] = useState({
    nombre: '',
    carrera: ''
  });
  // estado para indicar si está guardando
  const [saving, setSaving] = useState(false);

  // cargar datos iniciales cuando hay un estudiante a editar
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        carrera: initialData.carrera || ''
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
    if (!formData.nombre.trim() || !formData.carrera.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }

    setSaving(true);
    try {
      if (initialData) {
        // modo edición
        await estudianteService.update(initialData.id, formData);
      } else {
        // modo creación
        await estudianteService.create(formData);
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
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>

        {/* campo carrera */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carrera *
          </label>
          <input
            type="text"
            name="carrera"
            value={formData.carrera}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Ingeniería de Sistemas"
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

export default EstudianteForm;
