import React from 'react';

const DashboardEstudiante = () => {
    return (
        <div className="card">
            <h1>Panel del Estudiante</h1>
            <div className="grid mt-4">
                <div className="col-12 md:col-6 lg:col-4">
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Actividades</span>
                                <div className="text-900 font-medium text-xl">Pendientes</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="bi bi-list-task text-blue-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">2 nuevas </span>
                        <span className="text-500">desde ayer</span>
                    </div>
                </div>

                <div className="col-12 md:col-6 lg:col-4">
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Evaluaciones</span>
                                <div className="text-900 font-medium text-xl">Próximas</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="bi bi-calendar text-orange-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-500">Examen Parcial 2 - </span>
                        <span className="text-primary font-medium">Mañana</span>
                    </div>
                </div>

                <div className="col-12 md:col-6 lg:col-4">
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Asistencia</span>
                                <div className="text-900 font-medium text-xl">95%</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="bi bi-check-circle text-cyan-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardEstudiante;
