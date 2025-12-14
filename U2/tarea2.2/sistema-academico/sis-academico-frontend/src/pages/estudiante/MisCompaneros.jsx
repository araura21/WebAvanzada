import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Accordion, Badge, Alert } from 'react-bootstrap';

const MisCompaneros = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [companerosData, setCompanerosData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const estudianteId = localStorage.getItem('estudianteId');
    const usuario = localStorage.getItem('usuario');

    useEffect(() => {
        fetchMisMatriculas();
    }, []);

    const fetchMisMatriculas = async () => {
        let id = estudianteId;
        if (!id && usuario) {
            try {
                const profResp = await fetch(`http://localhost:3000/api/estudiantes/perfil/${usuario}`);
                if (profResp.ok) {
                    const profData = await profResp.json();
                    id = profData.id;
                    localStorage.setItem('estudianteId', id);
                }
            } catch (e) {
                console.error("Error recuperando ID", e);
            }
        }

        if (!id) {
            setError("No se pudo identificar tu perfil de estudiante.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/matriculas/historial/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const matriculas = await res.json();

            setAsignaturas(matriculas);

            // Cargar compañeros por cada materia
            const companerosMap = {};

            await Promise.all(matriculas.map(async (mat) => {
                if (!mat.Asignatura) return;
                const asigId = mat.Asignatura.id;
                try {
                    const resClase = await fetch(`http://localhost:3000/api/matriculas/clase/${asigId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const companeros = await resClase.json();
                    // Filtrar para no mostrarme a mi mismo (opcional)
                    companerosMap[asigId] = companeros.filter(c => c.id != id);
                } catch (e) {
                    console.error("Error cargando clase", asigId);
                }
            }));

            setCompanerosData(companerosMap);
            setLoading(false);

        } catch (err) {
            setError("Error al cargar datos");
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Cargando compañeros...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Mis Compañeros de Clase</h2>

            {asignaturas.length === 0 && <p>No estás matriculado en ninguna asignatura.</p>}

            <Accordion defaultActiveKey="0">
                {asignaturas.map((mat, index) => {
                    if (!mat.Asignatura) return null;
                    const asigId = mat.Asignatura.id;
                    const lista = companerosData[asigId] || [];

                    return (
                        <Accordion.Item eventKey={String(index)} key={mat.id}>
                            <Accordion.Header>
                                {mat.Asignatura.nombre}
                                <Badge bg="info" className="ms-2">{lista.length} Compañeros</Badge>
                            </Accordion.Header>
                            <Accordion.Body>
                                {lista.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {lista.map(comp => (
                                            <ListGroup.Item key={comp.id} className="d-flex align-items-center">
                                                <div className="ms-2 me-auto">
                                                    <div className="fw-bold">{comp.apellidos} {comp.nombres}</div>
                                                    <small className="text-muted">{comp.correo}</small>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p className="text-muted">No hay otros estudiantes en esta clase.</p>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default MisCompaneros;
