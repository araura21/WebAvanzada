import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Alert, Form, Row, Col } from 'react-bootstrap';

const ResumenNotasDocente = () => {
    const [notas, setNotas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [filtroAsignatura, setFiltroAsignatura] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const docenteId = localStorage.getItem('docenteId') || 1; // Fallback

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('usuario');

            if (!token || !storedUser) {
                setError("No se encontró usuario o token de autenticación");
                setLoading(false);
                return;
            }

            // Parse user from localStorage (handles both string and object formats)
            let currentUsername = null;
            try {
                const parsed = JSON.parse(storedUser);
                currentUsername = parsed.usuario || parsed;
            } catch (e) {
                currentUsername = storedUser;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            try {
                // 0. Obtener usuario actual para ID
                const usersRes = await fetch('http://localhost:3000/api/users', { headers });
                if (!usersRes.ok) throw new Error('Error al validar usuario');
                const usersData = await usersRes.json();
                const currentUser = usersData.find(u => u.usuario === currentUsername);

                if (!currentUser) throw new Error('Usuario no encontrado en sistema');

                // 1. Obtener asignaturas y FILTRAR por docente
                const asigRes = await fetch('http://localhost:3000/api/asignaturas', { headers });
                if (!asigRes.ok) throw new Error('Error al cargar asignaturas');
                const allAsignaturas = await asigRes.json();
                const asigData = Array.isArray(allAsignaturas)
                    ? allAsignaturas.filter(a => a.usuarioId === currentUser.id)
                    : [];
                setAsignaturas(asigData);

                // 2. Obtener estudiantes
                const estRes = await fetch('http://localhost:3000/api/estudiantes', { headers });
                if (!estRes.ok) throw new Error('Error al cargar estudiantes');
                const estData = await estRes.json();
                setEstudiantes(Array.isArray(estData) ? estData : []);

                // 3. Obtener TODAS las notas
                const notasRes = await fetch('http://localhost:3000/api/notas', { headers });
                if (!notasRes.ok) throw new Error('Error al cargar notas');
                const notasData = await notasRes.json();
                setNotas(Array.isArray(notasData) ? notasData : []);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Error al cargar datos: " + err.message);
                setLoading(false);
                setAsignaturas(prev => Array.isArray(prev) ? prev : []);
                setEstudiantes(prev => Array.isArray(prev) ? prev : []);
                setNotas(prev => Array.isArray(prev) ? prev : []);
            }
        };
        fetchData();
    }, []);

    // Procesar datos para la matriz...
    const procesarDatos = () => {
        const matrix = {};

        estudiantes.forEach(est => {
            matrix[est.id] = {
                nombre: `${est.nombres} ${est.apellidos}`,
                cedula: est.cedula,
                asignaturas: {}
            };
        });

        notas.forEach(nota => {
            if (matrix[nota.estudianteId]) {
                const asigId = nota.asignaturaId;
                if (!matrix[nota.estudianteId].asignaturas[asigId]) {
                    matrix[nota.estudianteId].asignaturas[asigId] = { P1: null, P2: null, P3: null };
                }
                matrix[nota.estudianteId].asignaturas[asigId][nota.parcial] = nota.total_parcial;
            }
        });

        return matrix;
    };

    const dataMatrix = procesarDatos();

    // Crear Set de IDs de asignaturas validas del docente para filtrado rápido
    const misAsignaturasIds = new Set(asignaturas.map(a => a.id));

    // Filtrar visualización
    const estudiantesFiltrados = Object.values(dataMatrix).filter(est => {
        // Verificar si el estudiante tiene notas en alguna de MIS asignaturas
        const tieneNotasEnMisClases = Object.keys(est.asignaturas).some(asigId =>
            misAsignaturasIds.has(parseInt(asigId))
        );

        // Si hay filtro de asignatura, debe coincidir
        if (filtroAsignatura) {
            return est.asignaturas[filtroAsignatura]; // Solo si tiene algo en esa
        }

        // Si no hay filtro, mostrar solo si tiene actividad en mis clases
        return tieneNotasEnMisClases;
    });

    // ... render return ... 

    // Validar asignaturasDelEstudiante en el render loop
    // ESTO VA DENTRO DEL RETURN, SE NECESITA OTRO REPLACE O MODIFICAR TODO EL COMPONENTE?
    // Voy a hacer un replace del fetch y dataMatrix primero, y luego otro del render loop si es necesario.
    // O mejor, reemplazo el bloque del render loop tambien si puedo ver las lineas.
    // El render loop esta mas abajo, lineas 123+.

    // Voy a reemplazar solo el useEffect y el procesarDatos/filtrado logica.
    // Y luego hare otro call para el render loop.


    if (loading) return <div>Cargando resumen...</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Resumen Global de Notas</h2>

            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Filtrar por Asignatura</Form.Label>
                                <Form.Select value={filtroAsignatura} onChange={e => setFiltroAsignatura(e.target.value)}>
                                    <option value="">Todas</option>
                                    {asignaturas.map(a => (
                                        <option key={a.id} value={a.id}>{a.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="table-responsive">
                <Table striped bordered hover size="sm">
                    <thead className="bg-light">
                        <tr>
                            <th>Estudiante</th>
                            <th>Asignatura</th>
                            <th className="text-center">P1</th>
                            <th className="text-center">P2</th>
                            <th className="text-center">P3</th>
                            <th className="text-center">Total</th>
                            <th className="text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantesFiltrados.map((est, idx) => {
                            // Si filtramos por asignatura, solo renderizamos esa
                            // Si no, renderizamos las asignaturas que tenga el estudiante QUE SEAN DEL DOCENTE
                            const misAsignaturasIds = asignaturas.map(a => a.id);

                            const asignaturasDelEstudiante = filtroAsignatura
                                ? [parseInt(filtroAsignatura)]
                                : Object.keys(est.asignaturas)
                                    .map(id => parseInt(id))
                                    .filter(id => misAsignaturasIds.includes(id));

                            if (asignaturasDelEstudiante.length === 0) return null;

                            return asignaturasDelEstudiante.map(asigId => {
                                const notasAsig = est.asignaturas[asigId] || { P1: null, P2: null, P3: null };
                                const asigNombre = asignaturas.find(a => a.id == asigId)?.nombre || 'N/A';

                                // Si filtramos y no tiene notas en esa materia, quizas, no mostrar?
                                // O mostrar vacio. Mostramos vacio.

                                const p1 = parseFloat(notasAsig.P1 || 0);
                                const p2 = parseFloat(notasAsig.P2 || 0);
                                const p3 = parseFloat(notasAsig.P3 || 0);
                                const total = (p1 + p2 + p3).toFixed(2);

                                let estado = "En curso";
                                let variant = "secondary";

                                if (notasAsig.P1 && notasAsig.P2) {
                                    if (p1 + p2 < 28) {
                                        estado = "Reprobado";
                                        variant = "danger";
                                    } else if (notasAsig.P3) {
                                        if (total >= 42) {
                                            estado = "Aprobado";
                                            variant = "success";
                                        } else {
                                            estado = "Reprobado";
                                            variant = "danger";
                                        }
                                    }
                                }

                                return (
                                    <tr key={`${est.cedula}-${asigId}`}>
                                        <td className="fw-bold">{est.nombre}</td>
                                        <td>{asigNombre}</td>
                                        <td className={`text-center ${!notasAsig.P1 ? 'bg-warning-subtle' : ''}`}>
                                            {notasAsig.P1 || '-'}
                                        </td>
                                        <td className={`text-center ${!notasAsig.P2 ? 'bg-warning-subtle' : ''}`}>
                                            {notasAsig.P2 || '-'}
                                        </td>
                                        <td className={`text-center ${!notasAsig.P3 ? 'bg-warning-subtle' : ''}`}>
                                            {notasAsig.P3 || '-'}
                                        </td>
                                        <td className="text-center fw-bold">{total}</td>
                                        <td className="text-center"><Badge bg={variant}>{estado}</Badge></td>
                                    </tr>
                                );
                            });
                        })}
                    </tbody>
                </Table>
            </div>
            <div className="mt-2 text-muted small">
                * Las celdas amarillas indican notas pendientes.
            </div>
        </div>
    );
};

export default ResumenNotasDocente;
