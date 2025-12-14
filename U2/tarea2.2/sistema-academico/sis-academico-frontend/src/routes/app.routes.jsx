import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import Estudiantes from '../pages/estudiantes';
import Docentes from '../pages/docentes';
import NotasPage from '../pages/notas';
import NotaForm from '../components/notas/nota.form';
import Login from '../pages/login';
import Inicio from '../pages/inicio';
import Ayuda from '../pages/ayuda';
import Navbar from '../components/layout/navbar';
import Sidebar from '../components/layout/sidebar';

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
                        <Route path="/" element={<Inicio />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/estudiantes" element={<Estudiantes />} />
                        <Route path="/docentes" element={<Docentes />} />
                        
                        {/* Rutas de Notas */}
                        <Route path="/notas" element={<NotasPage />} />
                        <Route path="/notas/crear" element={<NotaForm />} />
                        <Route path="/notas/editar/:id" element={<NotaForm />} />
                        
                        <Route path="/ayuda" element={<Ayuda />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AppRoutes;
