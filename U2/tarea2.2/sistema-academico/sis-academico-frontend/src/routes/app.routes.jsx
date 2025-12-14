import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import NotasPage from '../pages/notas';
import NotaForm from '../components/notas/nota.form';
import Login from '../pages/login';
import Ayuda from '../pages/ayuda';
import Navbar from '../components/layout/navbar';
import Sidebar from '../components/layout/sidebar';

// Admin Pages
import GestionUsuarios from '../pages/admin/GestionUsuarios';
import GestionAsignaturas from '../pages/admin/GestionAsignaturas';
import GestionEstudiantesAdmin from '../pages/admin/GestionEstudiantes';
import GestionDocentesAdmin from '../pages/admin/GestionDocentes';
import GestionMatriculasAdmin from '../pages/admin/GestionMatriculas';

// Estudiante Pages
import DashboardEstudiante from '../pages/estudiante/DashboardEstudiante';
import NotasEstudiante from '../pages/estudiante/NotasEstudiante';
import PerfilEstudiante from '../pages/estudiante/PerfilEstudiante';
import MisCompaneros from '../pages/estudiante/MisCompaneros';

// Docente Pages
import DashboardDocente from '../pages/docente/DashboardDocente';
import MisClases from '../pages/docente/MisClases';
import GestionNotas from '../pages/docente/GestionNotas';
import ResumenNotasDocente from '../pages/docente/ResumenNotasDocente';

const DefaultRedirect = () => {
    const rol = localStorage.getItem('rol');
    if (rol === 'estudiante') return <Navigate to="/estudiante/dashboard" />;
    if (rol === 'docente') return <Navigate to="/docente/dashboard" />;
    return <Navigate to="/dashboard" />;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const rol = localStorage.getItem('rol');
    if (allowedRoles && !allowedRoles.includes(rol)) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const AppRoutes = ({ isAuthenticated, onLogout }) => {
    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
                <Navbar onLogout={onLogout} />
                <div className="container-fluid p-4">
                    <Routes>
                        <Route path="/" element={<DefaultRedirect />} />

                        {/* Admin Routes */}
                        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
                        <Route path="/admin/estudiantes" element={<ProtectedRoute allowedRoles={['admin']}><GestionEstudiantesAdmin /></ProtectedRoute>} />
                        <Route path="/admin/docentes" element={<ProtectedRoute allowedRoles={['admin']}><GestionDocentesAdmin /></ProtectedRoute>} />
                        <Route path="/admin/matriculas" element={<ProtectedRoute allowedRoles={['admin']}><GestionMatriculasAdmin /></ProtectedRoute>} />
                        <Route path="/notas" element={<ProtectedRoute allowedRoles={['admin']}><NotasPage /></ProtectedRoute>} />
                        <Route path="/notas/crear" element={<ProtectedRoute allowedRoles={['admin']}><NotaForm /></ProtectedRoute>} />
                        <Route path="/notas/editar/:id" element={<ProtectedRoute allowedRoles={['admin']}><NotaForm /></ProtectedRoute>} />
                        <Route path="/admin/usuarios" element={<ProtectedRoute allowedRoles={['admin']}><GestionUsuarios /></ProtectedRoute>} />
                        <Route path="/admin/asignaturas" element={<ProtectedRoute allowedRoles={['admin']}><GestionAsignaturas /></ProtectedRoute>} />

                        {/* Estudiante Routes */}
                        <Route path="/estudiante/dashboard" element={<ProtectedRoute allowedRoles={['estudiante']}><DashboardEstudiante /></ProtectedRoute>} />
                        <Route path="/estudiante/notas" element={<ProtectedRoute allowedRoles={['estudiante']}><NotasEstudiante /></ProtectedRoute>} />
                        <Route path="/estudiante/perfil" element={<ProtectedRoute allowedRoles={['estudiante']}><PerfilEstudiante /></ProtectedRoute>} />
                        <Route path="/estudiante/companeros" element={<ProtectedRoute allowedRoles={['estudiante']}><MisCompaneros /></ProtectedRoute>} />

                        {/* Docente Routes */}
                        <Route path="/docente/dashboard" element={<ProtectedRoute allowedRoles={['docente']}><DashboardDocente /></ProtectedRoute>} />
                        <Route path="/docente/clases" element={<ProtectedRoute allowedRoles={['docente']}><MisClases /></ProtectedRoute>} />
                        <Route path="/docente/notas/:id" element={<ProtectedRoute allowedRoles={['docente']}><GestionNotas /></ProtectedRoute>} />
                        <Route path="/docente/resumen" element={<ProtectedRoute allowedRoles={['docente']}><ResumenNotasDocente /></ProtectedRoute>} />

                        <Route path="/ayuda" element={<Ayuda />} />
                        <Route path="*" element={<DefaultRedirect />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AppRoutes;
