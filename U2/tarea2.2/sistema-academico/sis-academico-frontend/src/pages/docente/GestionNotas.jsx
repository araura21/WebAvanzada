import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { validarNumerico, validarTexto } from '../../utils/validations';

const GestionNotas = () => {
    const [notas, setNotas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);

    // Filtros
    const [filtroAsignatura, setFiltroAsignatura] = useState('');
    const [filtroParcial, setFiltroParcial] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        estudianteId: '',
        asignaturaId: '',
        parcial: 'P1',
        nota_tarea: 0,
        nota_informe: 0,
        nota_leccion: 0,
        nota_examen: 0,
        observaciones: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const docenteId = localStorage.getItem('docenteId') || 1; // Fallback ID si no hay login real de docente

    // Cargar datos iniciales
    useEffect(() => {
        fetchDependencies();
        fetchNotas();
    }, []);

    const fetchDependencies = async () => {
        try {
            const [estRes, asigRes] = await Promise.all([
                fetch('http://localhost:3000/api/estudiantes'),
                fetch('http://localhost:3000/api/asignaturas')
            ]);
            setEstudiantes(await estRes.json());
            setAsignaturas(await asigRes.json());
        } catch (e) {
            console.error("Error cargando dependencias", e);
        }
    };

    const fetchNotas = async () => {
        try {
            let url = 'http://localhost:3000/api/notas?';
            if (filtroAsignatura) url += `asignaturaId=${filtroAsignatura}&`;
            if (filtroParcial) url += `parcial=${filtroParcial}&`;

            const res = await fetch(url);
            const data = await res.json();
            setNotas(data);
        } catch (e) {
            setError('Error al cargar notas');
        }
    };

    // Refrescar cuando cambian filtros
    useEffect(() => {
        fetchNotas();
    }, [filtroAsignatura, filtroParcial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validaciones Manuales (aunque HTML required ayuda)
        if (!formData.estudianteId || !formData.asignaturaId) {
            setError("Estudiante y Asignatura son obligatorios");
            setLoading(false);
            return;
        }

        if (!validarNumerico(formData.nota_tarea, 0, 20) ||
            !validarNumerico(formData.nota_informe, 0, 20) ||
            !validarNumerico(formData.nota_leccion, 0, 20) ||
            !validarNumerico(formData.nota_examen, 0, 20)) {
            setError("Todas las notas deben estar entre 0 y 20");
            setLoading(false);
            return;
        }

        if (!validarTexto(formData.observaciones)) {
            setError("Las observaciones contienen caracteres no permitidos");
            setLoading(false);
            return;
        }

        try {
            const method = editing ? 'PUT' : 'POST';
            const url = editing
                ? `http://localhost:3000/api/notas/${currentId}`
                : 'http://localhost:3000/api/notas';

            // Inyectar docenteId si es nuevo
            const payload = { ...formData, docenteId: editing ? formData.docenteId : docenteId };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Error al guardar');
            }

            setSuccess(editing ? 'Nota actualizada' : 'Nota registrada');
            setShowModal(false);
            fetchNotas();
            if (!editing) resetForm();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            estudianteId: '', asignaturaId: '', parcial: 'P1',
            nota_tarea: 0, nota_informe: 0, nota_leccion: 0, nota_examen: 0, observaciones: ''
        });
        setEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (nota) => {
        setFormData({
            estudianteId: nota.estudianteId,
            asignaturaId: nota.asignaturaId,
            parcial: nota.parcial,
            nota_tarea: nota.nota_tarea,
            nota_informe: nota.nota_informe,
            nota_leccion: nota.nota_leccion,
            nota_examen: nota.nota_examen,
            observaciones: nota.observaciones || ''
        });
        setCurrentId(nota.id);
        setEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta nota?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/notas/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSuccess('Nota eliminada');
                fetchNotas();
            } else {
                setError('Error al eliminar');
            }
        } catch (e) {
            setError('Error de conexión');
        }
    };

    // Helper para nombre de estudiante
    const getEstudianteNombre = (id) => {
        const est = estudiantes.find(e => e.id === id);
        return est ? `${est.nombres} ${est.apellidos}` : id;
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Gestión de Calificaciones</h2>

            <Row className="mb-3">
                <Col md={3}>
                    <Form.Select value={filtroAsignatura} onChange={(e) => setFiltroAsignatura(e.target.value)}>
                        <option value="">Todas las Asignaturas</option>
                        {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select value={filtroParcial} onChange={(e) => setFiltroParcial(e.target.value)}>
                        <option value="">Todos los Parciales</option>
                        <option value="P1">Parcial 1</option>
                        <option value="P2">Parcial 2</option>
                        <option value="P3">Parcial 3</option>
                    </Form.Select>
                </Col>
                <Col className="text-end">
                    <Button onClick={() => { resetForm(); setShowModal(true); }}>
                        <i className="bi bi-plus-lg mr-2"></i> Registrar Nota
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Estudiante</th>
                        <th>Asignatura</th>
                        <th>Parcial</th>
                        <th>Tarea (20%)</th>
                        <th>Informe (20%)</th>
                        <th>Lección (20%)</th>
                        <th>Examen (40%)</th>
                        <th>Total (20)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {notas.map(nota => (
                        <tr key={nota.id}>
                            <td>{nota.Estudiante ? `${nota.Estudiante.nombres} ${nota.Estudiante.apellidos}` : nota.estudianteId}</td>
                            <td>{nota.Asignatura ? nota.Asignatura.nombre : nota.asignaturaId}</td>
                            <td>{nota.parcial}</td>
                            <td>{nota.nota_tarea}</td>
                            <td>{nota.nota_informe}</td>
                            <td>{nota.nota_leccion}</td>
                            <td>{nota.nota_examen}</td>
                            <td className="fw-bold">{nota.total_parcial || '-'}</td>
                            <td>
                                <Button variant="sm" className="btn-info me-2" onClick={() => handleEdit(nota)}>
                                    <i className="bi bi-pencil"></i>
                                </Button>
                                <Button variant="sm" className="btn-danger" onClick={() => handleDelete(nota.id)}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {notas.length === 0 && <tr><td colSpan="9" className="text-center">No hay notas registradas</td></tr>}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Editar Nota' : 'Registrar Nota'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estudiante</Form.Label>
                                    <Form.Select name="estudianteId" value={formData.estudianteId} onChange={handleChange} required disabled={editing}>
                                        <option value="">Seleccione Estudiante</option>
                                        {estudiantes.map(e => (
                                            <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Asignatura</Form.Label>
                                    <Form.Select name="asignaturaId" value={formData.asignaturaId} onChange={handleChange} required disabled={editing}>
                                        <option value="">Seleccione Asignatura</option>
                                        {asignaturas.map(a => (
                                            <option key={a.id} value={a.id}>{a.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Parcial</Form.Label>
                                    <Form.Select name="parcial" value={formData.parcial} onChange={handleChange} disabled={editing}>
                                        <option value="P1">Parcial 1</option>
                                        <option value="P2">Parcial 2</option>
                                        <option value="P3">Parcial 3</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="p-3 bg-light border rounded mb-3">
                            <h6>Califiaciones (0 - 20)</h6>
                            <Row>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Tarea</Form.Label>
                                        <Form.Control type="number" step="0.01" min="0" max="20" name="nota_tarea" value={formData.nota_tarea} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Informe</Form.Label>
                                        <Form.Control type="number" step="0.01" min="0" max="20" name="nota_informe" value={formData.nota_informe} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Lección</Form.Label>
                                        <Form.Control type="number" step="0.01" min="0" max="20" name="nota_leccion" value={formData.nota_leccion} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Examen</Form.Label>
                                        <Form.Control type="number" step="0.01" min="0" max="20" name="nota_examen" value={formData.nota_examen} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control as="textarea" rows={2} name="observaciones" value={formData.observaciones} onChange={handleChange} />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Calificación'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GestionNotas;
