import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import Estudiantes from '../pages/estudiantes';
import Docentes from '../pages/docentes';
import NotasPage from '../pages/notas';
import NotaForm from '../components/notas/nota.form';
import Login from '../pages/login';
import Ayuda from '../pages/ayuda';
import Navbar from '../components/layout/navbar';
import Sidebar from '../components/layout/sidebar';

// Admin Pages
import GestionUsuarios from '../pages/admin/GestionUsuarios';

// Estudiante Pages
import DashboardEstudiante from '../pages/estudiante/DashboardEstudiante';
import NotasEstudiante from '../pages/estudiante/NotasEstudiante';
import PerfilEstudiante from '../pages/estudiante/PerfilEstudiante';

// Docente Pages
import DashboardDocente from '../pages/docente/DashboardDocente';
import GestionEstudiantes from '../pages/docente/GestionEstudiantes';
import GestionNotas from '../pages/docente/GestionNotas';

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
                        <Route path="/estudiantes" element={<ProtectedRoute allowedRoles={['admin']}><Estudiantes /></ProtectedRoute>} />
                        <Route path="/docentes" element={<ProtectedRoute allowedRoles={['admin']}><Docentes /></ProtectedRoute>} />
                        <Route path="/notas" element={<ProtectedRoute allowedRoles={['admin']}><NotasPage /></ProtectedRoute>} />
                        <Route path="/notas/crear" element={<ProtectedRoute allowedRoles={['admin']}><NotaForm /></ProtectedRoute>} />
                        <Route path="/notas/editar/:id" element={<ProtectedRoute allowedRoles={['admin']}><NotaForm /></ProtectedRoute>} />

                        <Route path="/admin/usuarios" element={<ProtectedRoute allowedRoles={['admin']}><GestionUsuarios /></ProtectedRoute>} />

                        {/* Estudiante Routes */}
                        <Route path="/estudiante/dashboard" element={<ProtectedRoute allowedRoles={['estudiante']}><DashboardEstudiante /></ProtectedRoute>} />
                        <Route path="/estudiante/notas" element={<ProtectedRoute allowedRoles={['estudiante']}><NotasEstudiante /></ProtectedRoute>} />
                        <Route path="/estudiante/perfil" element={<ProtectedRoute allowedRoles={['estudiante']}><PerfilEstudiante /></ProtectedRoute>} />

                        {/* Docente Routes */}
                        <Route path="/docente/dashboard" element={<ProtectedRoute allowedRoles={['docente']}><DashboardDocente /></ProtectedRoute>} />
                        <Route path="/docente/estudiantes" element={<ProtectedRoute allowedRoles={['docente']}><GestionEstudiantes /></ProtectedRoute>} />
                        <Route path="/docente/notas" element={<ProtectedRoute allowedRoles={['docente']}><GestionNotas /></ProtectedRoute>} />

                        <Route path="/ayuda" element={<Ayuda />} />
                        <Route path="*" element={<DefaultRedirect />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AppRoutes;
