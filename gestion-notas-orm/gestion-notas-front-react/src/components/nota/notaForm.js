import React, { useState, useEffect } from 'react';
import notaService from '../../services/notaServices.js';
import estudianteService from '../../services/estudianteServices.js';
import asignaturaService from '../../services/asignaturaServices.js';

const NotaForm = ({ initialData, onSave, onCancel }) => {
  // estado del formulario
  const [formData, setFormData] = useState({
    estudianteId: '',
    asignaturaId: '',
    nota1: '',
    nota2: '',
    nota3: ''
  });
  // listas para los selectores
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  // estado para indicar si está guardando
  const [saving, setSaving] = useState(false);

  // cargar datos iniciales, estudiantes y asignaturas
  useEffect(() => {
    cargarEstudiantes();
    cargarAsignaturas();
    if (initialData) {
      setFormData({
        estudianteId: initialData.estudianteId || '',
        asignaturaId: initialData.asignaturaId || '',
        nota1: initialData.nota1 || '',
        nota2: initialData.nota2 || '',
        nota3: initialData.nota3 || ''
      });
    }
  }, [initialData]);

  // cargar lista de estudiantes
  const cargarEstudiantes = async () => {
    try {
      const data = await estudianteService.getAll();
      setEstudiantes(data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  };

  // cargar lista de asignaturas
  const cargarAsignaturas = async () => {
    try {
      const data = await asignaturaService.getAll();
      setAsignaturas(data);
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
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
    if (!formData.estudianteId || !formData.asignaturaId || 
        !formData.nota1 || !formData.nota2 || !formData.nota3) {
      alert('Todos los campos son obligatorios');
      return;
    }

    // validar rango de notas (0-20)
    const n1 = parseFloat(formData.nota1);
    const n2 = parseFloat(formData.nota2);
    const n3 = parseFloat(formData.nota3);

    if (n1 < 0 || n1 > 20 || n2 < 0 || n2 > 20 || n3 < 0 || n3 > 20) {
      alert('Las notas deben estar entre 0 y 20');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        estudianteId: parseInt(formData.estudianteId),
        asignaturaId: parseInt(formData.asignaturaId),
        nota1: n1,
        nota2: n2,
        nota3: n3
      };

      if (initialData) {
        // modo edición
        await notaService.update(initialData.id, payload);
      } else {
        // modo creación
        await notaService.create(payload);
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
        {/* selector de estudiante */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estudiante *
          </label>
          <select
            name="estudianteId"
            value={formData.estudianteId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map(est => (
              <option key={est.id} value={est.id}>
                {est.nombre} - {est.carrera}
              </option>
            ))}
          </select>
        </div>

        {/* selector de asignatura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asignatura *
          </label>
          <select
            name="asignaturaId"
            value={formData.asignaturaId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccione una asignatura</option>
            {asignaturas.map(asig => (
              <option key={asig.id} value={asig.id}>
                {asig.codigo} - {asig.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* campos de notas */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nota 1 *
            </label>
            <input
              type="number"
              name="nota1"
              value={formData.nota1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0-20"
              min="0"
              max="20"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nota 2 *
            </label>
            <input
              type="number"
              name="nota2"
              value={formData.nota2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0-20"
              min="0"
              max="20"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nota 3 *
            </label>
            <input
              type="number"
              name="nota3"
              value={formData.nota3}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0-20"
              min="0"
              max="20"
              step="0.1"
              required
            />
          </div>
        </div>

        {/* información adicional */}
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Nota:</strong> El promedio y la categoría se calcularán automáticamente en el backend.
            Categoría: Aprobado si promedio ≥ 14, Reprobado si promedio &lt; 14.
          </p>
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

export default NotaForm;
