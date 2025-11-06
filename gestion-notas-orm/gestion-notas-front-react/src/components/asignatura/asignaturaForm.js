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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* campo nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la asignatura *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Programación Orientada a Objetos"
            required
          />
        </div>

        {/* campo código */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código *
          </label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: POO101"
            required
          />
        </div>

        {/* campo créditos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Créditos *
          </label>
          <input
            type="number"
            name="creditos"
            value={formData.creditos}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 4"
            min="1"
            required
          />
        </div>

        {/* campo docente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Docente (opcional)
          </label>
          <select
            name="docenteId"
            value={formData.docenteId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sin asignar</option>
            {docentes.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.nombre} - {doc.departamento}
              </option>
            ))}
          </select>
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

export default AsignaturaForm;
