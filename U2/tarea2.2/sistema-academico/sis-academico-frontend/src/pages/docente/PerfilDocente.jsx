import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

const PerfilDocente = () => {
    const [docente, setDocente] = useState(null);
    const [loading, setLoading] = useState(true);
    const usuario = localStorage.getItem('usuario'); // Correo o cédula

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/docentes/perfil/${usuario}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setDocente(data);
                    // Guardar ID
                    localStorage.setItem('docenteId', data.id);
                } else {
                    console.error("No se encontró perfil");
                }
            } catch (error) {
                console.error("Error fetching perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        if (usuario) {
            fetchPerfil();
        } else {
            setLoading(false);
        }
    }, [usuario]);

    if (loading) return <div>Cargando perfil...</div>;
    if (!docente) return <div>No se encontró información del docente.</div>;

    return (
        <div className="container mt-4">
            <Card className="shadow-sm">
                <Card.Header as="h5" className="bg-primary text-white">Mi Perfil</Card.Header>
                <Card.Body>
                    <div className="row">
                        <div className="col-md-4 text-center">
                            {docente.foto ? (
                                <img src={`http://localhost:3000/${docente.foto.replace(/\\/g, '/')}`} alt="Perfil" className="img-thumbnail rounded-circle" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                            ) : (
                                <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '150px', height: '150px', fontSize: '3rem' }}>
                                    {docente.nombres?.charAt(0)}{docente.apellidos?.charAt(0)}
                                </div>
                            )}
                            <h4 className="mt-3">{docente.nombres} {docente.apellidos}</h4>
                            <p className="text-muted">Docente</p>
                        </div>
                        <div className="col-md-8">
                            <h5 className="mb-3 border-bottom pb-2">Información Personal</h5>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Cédula:</div>
                                <div className="col-sm-8">{docente.cedula}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Correo:</div>
                                <div className="col-sm-8">{docente.correo}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Teléfono:</div>
                                <div className="col-sm-8">{docente.telefono || 'No registrado'}</div>
                            </div>

                            <h5 className="mb-3 mt-4 border-bottom pb-2">Información Profesional</h5>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Especialidad:</div>
                                <div className="col-sm-8">{docente.especialidad || 'General'}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Estado:</div>
                                <div className="col-sm-8">
                                    <span className={`badge ${docente.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                                        {docente.estado}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PerfilDocente;
