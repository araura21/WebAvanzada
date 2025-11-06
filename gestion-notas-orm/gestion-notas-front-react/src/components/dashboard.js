import React, { useState, useEffect } from 'react';
import EstudianteList from './estudiante/estudianteList';
import EstudianteForm from './estudiante/estudianteForm';
import AsignaturaList from './asignatura/asignaturaList';
import AsignaturaForm from './asignatura/asignaturaForm';
import DocenteList from './docente/docenteList';
import DocenteForm from './docente/docenteForm';
import NotaList from './nota/notaList';
import NotaForm from './nota/notaForm';

import estudianteService from '../services/estudianteServices.js';
import asignaturaService from '../services/asignaturaServices.js';
import docenteService from '../services/docenteServices.js';
import notaService from '../services/notaServices.js';

const SistemaNotas = () => {
  // estado de la pestaña activa
  const [activeTab, setActiveTab] = useState('estudiantes');
  // estado para mostrar u ocultar el modal
  const [showModal, setShowModal] = useState(false);
  // estado para el item que se está editando (null = modo crear)
  const [editingItem, setEditingItem] = useState(null);
  // estado para indicar carga de datos
  const [loading, setLoading] = useState(false);
  // estado para forzar recarga de listas
  const [reloadKey, setReloadKey] = useState(0);

  // función para abrir el modal de formulario
  const openModal = (item = null) => {
    setEditingItem(item);
    setShowModal(true);
  };

  // función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  // función para manejar el guardado desde el formulario
  const handleSave = async (payload) => {
    try {
      // el formulario se encarga de crear o actualizar
      // aquí solo recargamos y cerramos
      setReloadKey(prev => prev + 1);
      closeModal();
      alert('Guardado correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar: ' + (error.message || error));
    }
  };

  // función para manejar la eliminación desde la lista
  const handleDelete = async () => {
    // la lista se encarga de eliminar
    // aquí solo recargamos
    setReloadKey(prev => prev + 1);
  };

  const TabButton = ({ name, icon, label }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
        activeTab === name
          ? 'bg-blue-600 text-white border-b-2 border-blue-600'
          : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </button>
  );

  // función para renderizar el título de la sección activa
  const getTitulo = () => {
    switch(activeTab) {
      case 'estudiantes': return 'Gestión de Estudiantes';
      case 'asignaturas': return 'Gestión de Asignaturas';
      case 'docentes': return 'Gestión de Docentes';
      case 'notas': return 'Gestión de Notas';
      default: return 'Gestión';
    }
  };

  // función para renderizar el botón de nuevo registro
  const getBotonNuevo = () => {
    const labels = {
      estudiantes: 'Nuevo Estudiante',
      asignaturas: 'Nueva Asignatura',
      docentes: 'Nuevo Docente',
      notas: 'Nueva Nota'
    };
    return labels[activeTab] || 'Nuevo';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span style={{ fontSize: 36 }}>🎓</span>
            Sistema de Registro de Notas
          </h1>
          <p className="text-blue-100 mt-2">Gestión Académica Integral</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 flex gap-2">
          <TabButton name="estudiantes" icon={'👥'} label="Estudiantes" />
          <TabButton name="asignaturas" icon={'📚'} label="Asignaturas" />
          <TabButton name="docentes" icon={'🎓'} label="Docentes" />
          <TabButton name="notas" icon={'🏆'} label="Notas" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* cabecera con título y botón nuevo */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{getTitulo()}</h2>
            <button
              onClick={() => openModal(null)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <span style={{ marginRight: 6 }}>➕</span>
              {getBotonNuevo()}
            </button>
          </div>

          {/* renderizar la lista correspondiente según la pestaña activa */}
          {activeTab === 'estudiantes' && (
            <EstudianteList key={reloadKey} onEdit={openModal} onDelete={handleDelete} />
          )}

          {activeTab === 'asignaturas' && (
            <AsignaturaList key={reloadKey} onEdit={openModal} onDelete={handleDelete} />
          )}

          {activeTab === 'docentes' && (
            <DocenteList key={reloadKey} onEdit={openModal} onDelete={handleDelete} />
          )}

          {activeTab === 'notas' && (
            <NotaList key={reloadKey} onEdit={openModal} onDelete={handleDelete} />
          )}
        </div>
      </main>

      {/* modal para formularios de creación/edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 className="text-xl font-bold">
                {editingItem ? 'Editar' : 'Nuevo'} {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">✖</button>
            </div>

            {/* renderizar el formulario correspondiente */}
            {activeTab === 'estudiantes' && (
              <EstudianteForm initialData={editingItem} onSave={handleSave} onCancel={closeModal} />
            )}

            {activeTab === 'asignaturas' && (
              <AsignaturaForm initialData={editingItem} onSave={handleSave} onCancel={closeModal} />
            )}

            {activeTab === 'docentes' && (
              <DocenteForm initialData={editingItem} onSave={handleSave} onCancel={closeModal} />
            )}

            {activeTab === 'notas' && (
              <NotaForm initialData={editingItem} onSave={handleSave} onCancel={closeModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SistemaNotas;