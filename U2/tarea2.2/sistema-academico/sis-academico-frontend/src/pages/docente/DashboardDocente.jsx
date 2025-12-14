import React from 'react';

const DashboardDocente = () => {
    return (
        <div className="card">
            <h1>Panel del Docente</h1>
            <div className="grid mt-4">
                <div className="col-12 md:col-6 lg:col-4">
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Cursos Asignados</span>
                                <div className="text-900 font-medium text-xl">4 Cursos</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-indigo-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="bi bi-journal-text text-indigo-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 md:col-6 lg:col-4">
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Notas Pendientes</span>
                                <div className="text-900 font-medium text-xl">15 Estudiantes</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="bi bi-pencil text-purple-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-pink-500 font-medium">3 días </span>
                        <span className="text-500">para cierre de parcial</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardDocente;
