import React, { useState } from 'react';
import EstudianteList from './estudiante/estudianteList';
import EstudianteForm from './estudiante/estudianteForm';
import AsignaturaList from './asignatura/asignaturaList';
import AsignaturaForm from './asignatura/asignaturaForm';
import DocenteList from './docente/docenteList';
import DocenteForm from './docente/docenteForm';
import NotaList from './nota/notaList';
import NotaForm from './nota/notaForm';

const SistemaNotas = () => {
  const [activeTab, setActiveTab] = useState('estudiantes');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const openForm = (item = null) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    setReloadKey(prev => prev + 1);
    closeForm();
  };

  const handleDelete = () => {
    setReloadKey(prev => prev + 1);
  };

  const TabButton = ({ name, label }) => (
    <button onClick={() => setActiveTab(name)} aria-pressed={activeTab === name}>{label}</button>
  );

  const getTitulo = () => {
    switch(activeTab) {
      case 'estudiantes': return 'Gestión de Estudiantes';
      case 'asignaturas': return 'Gestión de Asignaturas';
      case 'docentes': return 'Gestión de Docentes';
      case 'notas': return 'Gestión de Notas';
      default: return 'Gestión';
    }
  };

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
    <div>
      <header>
        <h1 align="center">Sistema de Gestión de Notas</h1>
      </header>

      <nav aria-label="Pestañas">
        <div align="center">
          <TabButton name="estudiantes" label="Estudiantes" />
          <TabButton name="asignaturas" label="Asignaturas" />
          <TabButton name="docentes" label="Docentes" />
          <TabButton name="notas" label="Notas" />
        </div>
      </nav>

      <main>
        <section>
          <div align="center">
            <h2>{getTitulo()}</h2>
            <button onClick={() => openForm(null)}>{getBotonNuevo()}</button>
            <br />
            <br />
          </div>

          <div align="center">
            {activeTab === 'estudiantes' && (
              <EstudianteList key={reloadKey} onEdit={openForm} onDelete={handleDelete} />
            )}
            {activeTab === 'asignaturas' && (
              <AsignaturaList key={reloadKey} onEdit={openForm} onDelete={handleDelete} />
            )}
            {activeTab === 'docentes' && (
              <DocenteList key={reloadKey} onEdit={openForm} onDelete={handleDelete} />
            )}
            {activeTab === 'notas' && (
              <NotaList key={reloadKey} onEdit={openForm} onDelete={handleDelete} />
            )}
          </div>

          <br />
          {showForm && (
            <div align="center">
              {activeTab === 'estudiantes' && (
                <EstudianteForm initialData={editingItem} onSave={handleSave} onCancel={closeForm} />
              )}
              {activeTab === 'asignaturas' && (
                <AsignaturaForm initialData={editingItem} onSave={handleSave} onCancel={closeForm} />
              )}
              {activeTab === 'docentes' && (
                <DocenteForm initialData={editingItem} onSave={handleSave} onCancel={closeForm} />
              )}
              {activeTab === 'notas' && (
                <NotaForm initialData={editingItem} onSave={handleSave} onCancel={closeForm} />
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SistemaNotas;