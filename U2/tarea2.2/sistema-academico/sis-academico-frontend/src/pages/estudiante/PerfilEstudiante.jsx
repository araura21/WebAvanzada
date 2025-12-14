import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';

const PerfilEstudiante = () => {
    const [estudiante, setEstudiante] = useState(null);
    const [loading, setLoading] = useState(true);
    const usuario = localStorage.getItem('usuario'); // Correo o cédula

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/estudiantes/perfil/${usuario}`);
                if (response.ok) {
                    const data = await response.json();
                    setEstudiante(data);
                    // Guardar ID para otras consultas
                    localStorage.setItem('estudianteId', data.id);
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
    if (!estudiante) return <div>No se encontró información del estudiante.</div>;

    return (
        <div className="container mt-4">
            <Card className="shadow-sm">
                <Card.Header as="h5" className="bg-primary text-white">Mi Perfil</Card.Header>
                <Card.Body>
                    <div className="row">
                        <div className="col-md-4 text-center">
                            {estudiante.foto ? (
                                <img src={`http://localhost:3000/${estudiante.foto}`} alt="Perfil" className="img-thumbnail rounded-circle" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                            ) : (
                                <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '150px', height: '150px', fontSize: '3rem' }}>
                                    {estudiante.nombres.charAt(0)}{estudiante.apellidos.charAt(0)}
                                </div>
                            )}
                            <h4 className="mt-3">{estudiante.nombres} {estudiante.apellidos}</h4>
                            <p className="text-muted">Estudiante</p>
                        </div>
                        <div className="col-md-8">
                            <h5 className="mb-3 border-bottom pb-2">Información Personal</h5>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Cédula:</div>
                                <div className="col-sm-8">{estudiante.cedula}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Correo:</div>
                                <div className="col-sm-8">{estudiante.correo}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Teléfono:</div>
                                <div className="col-sm-8">{estudiante.telefono || 'No registrado'}</div>
                            </div>

                            <h5 className="mb-3 mt-4 border-bottom pb-2">Información Académica</h5>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Curso:</div>
                                <div className="col-sm-8">{estudiante.curso || 'No asignado'}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Paralelo:</div>
                                <div className="col-sm-8">{estudiante.paralelo || 'No asignado'}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-4 fw-bold">Estado:</div>
                                <div className="col-sm-8">
                                    <span className={`badge ${estudiante.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                                        {estudiante.estado}
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

export default PerfilEstudiante;
