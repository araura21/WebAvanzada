import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Alert } from 'react-bootstrap';

const NotasEstudiante = () => {
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const estudianteId = localStorage.getItem('estudianteId');
    const usuario = localStorage.getItem('usuario');

    useEffect(() => {
        const fetchData = async () => {
            let id = estudianteId;

            // Si no tenemos ID, intentamos obtenerlo del perfil
            if (!id && usuario) {
                try {
                    const profResp = await fetch(`http://localhost:3000/api/estudiantes/perfil/${usuario}`);
                    if (profResp.ok) {
                        const profData = await profResp.json();
                        id = profData.id;
                        localStorage.setItem('estudianteId', id);
                    }
                } catch (e) {
                    console.error("Error recuperando ID estudiante", e);
                }
            }

            if (!id) {
                setError("No se pudo identificar al estudiante");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/notas?estudianteId=${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setNotas(data);
                } else {
                    setError("Error al cargar las notas");
                }
            } catch (err) {
                setError("Error de conexión");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [estudianteId, usuario]);

    // Función para calcular total sobre 20 y convertir a 14
    const calcularParcial = (nota) => {
        if (!nota) return 0;
        const total20 =
            (parseFloat(nota.nota_tarea || 0) * 0.20) +
            (parseFloat(nota.nota_informe || 0) * 0.20) +
            (parseFloat(nota.nota_leccion || 0) * 0.20) +
            (parseFloat(nota.nota_examen || 0) * 0.40);

        return {
            sobre20: total20.toFixed(2),
            sobre14: ((total20 / 20) * 14).toFixed(2)
        };
    };

    // Agrupar por asignatura
    const notasPorAsignatura = {};
    notas.forEach(nota => {
        const materia = nota.Asignatura?.nombre || 'Desconocida';
        if (!notasPorAsignatura[materia]) {
            notasPorAsignatura[materia] = { P1: null, P2: null, P3: null };
        }
        if (nota.parcial === 'P1') notasPorAsignatura[materia].P1 = nota;
        if (nota.parcial === 'P2') notasPorAsignatura[materia].P2 = nota;
        if (nota.parcial === 'P3') notasPorAsignatura[materia].P3 = nota;
    });

    if (loading) return <div className="text-center mt-5">Cargando notas...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Mis Calificaciones</h2>
            <Card className="shadow-sm">
                <Card.Body>
                    <Table responsive striped bordered hover>
                        <thead className="bg-light">
                            <tr>
                                <th>Asignatura</th>
                                <th className="text-center">Parcial 1 (20 pts)</th>
                                <th className="text-center">Parcial 2 (20 pts)</th>
                                <th className="text-center">Parcial 3 (20 pts)</th>
                                <th className="text-center">Total (60 pts)</th>
                                <th className="text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(notasPorAsignatura).map(([materia, parials]) => {
                                const p1 = parials.P1 ? parials.P1.total_parcial : 0;
                                const p2 = parials.P2 ? parials.P2.total_parcial : 0;
                                const p3 = parials.P3 ? parials.P3.total_parcial : 0;

                                const totalSemestre = (parseFloat(p1) + parseFloat(p2) + parseFloat(p3)).toFixed(2);

                                let estado = "En Curso";
                                let badgeVariant = "primary";

                                const sumaP1P2 = parseFloat(p1) + parseFloat(p2);

                                // Lógica de aprobación actualizada
                                if (parials.P1 && parials.P2) {
                                    // Regla: Si suma de P1 y P2 es menor a 28, reprueba el semestre
                                    if (sumaP1P2 < 28) {
                                        estado = "Reprobado (P1+P2 < 28)";
                                        badgeVariant = "danger";
                                    }
                                    // Si tiene los 3 parciales
                                    else if (parials.P3) {
                                        // Regla: Suma total debe ser >= 42
                                        if (totalSemestre >= 42) {
                                            estado = "Aprobado";
                                            badgeVariant = "success";
                                        } else {
                                            estado = "Reprobado";
                                            badgeVariant = "danger";
                                        }
                                    }
                                    // Si tiene P1 y P2 >= 28 pero falta P3
                                    else {
                                        estado = "Pendiente Parcial 3";
                                        badgeVariant = "warning";
                                    }
                                }

                                return (
                                    <tr key={materia}>
                                        <td className="fw-bold">{materia}</td>
                                        <td className="text-center">
                                            {parials.P1 ? parials.P1.total_parcial : '-'}
                                        </td>
                                        <td className="text-center">
                                            {parials.P2 ? parials.P2.total_parcial : '-'}
                                        </td>
                                        <td className="text-center">
                                            {parials.P3 ? parials.P3.total_parcial : '-'}
                                        </td>
                                        <td className="text-center fw-bold">{totalSemestre} / 60</td>
                                        <td className="text-center">
                                            <Badge bg={badgeVariant}>{estado}</Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                            {Object.keys(notasPorAsignatura).length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">No hay notas registradas</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <div className="mt-3 text-muted small">
                * Para aprobar el semestre se requiere un m&iacute;nimo de 42/60 puntos. Si la suma del Parcial 1 y 2 es menor a 28, se reprueba autom&aacute;ticamente.
            </div>
        </div>
    );
};

export default NotasEstudiante;
