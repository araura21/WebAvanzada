import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Table, Row, Col, Modal } from 'react-bootstrap';

const MisClases = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [selectedAsignatura, setSelectedAsignatura] = useState('');
    const [estudiantes, setEstudiantes] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    // Estado para Modal de Calificación
    const [showModal, setShowModal] = useState(false);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const [formData, setFormData] = useState({
        parcial: 'P1',
        nota_tarea: 0,
        nota_informe: 0,
        nota_leccion: 0,
        nota_examen: 0,
        observaciones: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        // Manejo robusto del usuario (puede ser string o JSON)
        let user = null;
        try {
            user = JSON.parse(storedUser);
        } catch (e) {
            user = { usuario: storedUser };
        }

        if (user) {
            setUserInfo(user);
            fetchAsignaturasDocente(user.usuario || user);
        }
    }, []);

    useEffect(() => {
        if (selectedAsignatura) {
            fetchEstudiantesMatriculados(selectedAsignatura);
        } else {
            setEstudiantes([]);
        }
    }, [selectedAsignatura]);

    const fetchAsignaturasDocente = async (usuario) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Obtener usuario completo para sacar el ID
            const resUsers = await fetch('http://localhost:3000/api/users', { headers });
            const users = await resUsers.json();
            const currentUser = users.find(u => u.usuario === usuario);

            if (currentUser) {
                const resAsig = await fetch('http://localhost:3000/api/asignaturas', { headers });
                const dataAsig = await resAsig.json();
                // Filtrar asignaturas del docente
                const misAsignaturas = dataAsig.filter(a => a.usuarioId === currentUser.id);
                setAsignaturas(misAsignaturas);
            }
        } catch (err) {
            console.error(err);
            setError("Error al cargar asignaturas");
        }
    };

    const fetchEstudiantesMatriculados = async (asignaturaId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/matriculas/clase/${asignaturaId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setEstudiantes(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCalificar = (estudiante) => {
        setSelectedEstudiante(estudiante);
        setFormData({
            parcial: 'P1',
            nota_tarea: 0,
            nota_informe: 0,
            nota_leccion: 0,
            nota_examen: 0,
            observaciones: ''
        });
        setShowModal(true);
    };

    const handleSaveCalificacion = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                estudianteId: selectedEstudiante.id,
                asignaturaId: selectedAsignatura,
                ...formData
            };

            const res = await fetch('http://localhost:3000/api/notas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccess(`Nota registrada para ${selectedEstudiante.nombres}`);
                setShowModal(false);
                setTimeout(() => setSuccess(null), 3000);
            } else {
                const err = await res.json();
                setError(err.message || "Error al guardar nota");
            }
        } catch (err) {
            setError("Error de conexión");
        }
    };

    const handleChangeForm = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Clases y Calificaciones</h2>
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            <Card className="mb-4">
                <Card.Header className="bg-primary text-white">1. Seleccionar Asignatura</Card.Header>
                <Card.Body>
                    <Form.Select
                        value={selectedAsignatura}
                        onChange={(e) => setSelectedAsignatura(e.target.value)}
                    >
                        <option value="">-- Seleccione una Asignatura --</option>
                        {asignaturas.map(a => (
                            <option key={a.id} value={a.id}>{a.nombre}</option>
                        ))}
                    </Form.Select>
                </Card.Body>
            </Card>

            {selectedAsignatura && (
                <Card>
                    <Card.Header>Estudiantes en Curso</Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    <th>Correo</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.map(est => (
                                    <tr key={est.id}>
                                        <td>{est.apellidos} {est.nombres} <br /><small className="text-muted">{est.cedula}</small></td>
                                        <td>{est.correo}</td>
                                        <td>
                                            <Button size="sm" variant="outline-primary" onClick={() => handleCalificar(est)}>
                                                <i className="bi bi-pencil-square"></i> Calificar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {estudiantes.length === 0 && (
                                    <tr><td colSpan="3" className="text-center">No hay estudiantes matriculados.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* Modal de Calificación */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Calificar a {selectedEstudiante?.nombres} {selectedEstudiante?.apellidos}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveCalificacion}>
                        <Form.Group className="mb-3">
                            <Form.Label>Parcial</Form.Label>
                            <Form.Select name="parcial" value={formData.parcial} onChange={handleChangeForm}>
                                <option value="P1">Parcial 1</option>
                                <option value="P2">Parcial 2</option>
                                <option value="P3">Parcial 3</option>
                            </Form.Select>
                        </Form.Group>

                        <Row>
                            <Col md={3}><Form.Group><Form.Label>Tarea</Form.Label><Form.Control type="number" name="nota_tarea" value={formData.nota_tarea} onChange={handleChangeForm} /></Form.Group></Col>
                            <Col md={3}><Form.Group><Form.Label>Informe</Form.Label><Form.Control type="number" name="nota_informe" value={formData.nota_informe} onChange={handleChangeForm} /></Form.Group></Col>
                            <Col md={3}><Form.Group><Form.Label>Lección</Form.Label><Form.Control type="number" name="nota_leccion" value={formData.nota_leccion} onChange={handleChangeForm} /></Form.Group></Col>
                            <Col md={3}><Form.Group><Form.Label>Examen</Form.Label><Form.Control type="number" name="nota_examen" value={formData.nota_examen} onChange={handleChangeForm} /></Form.Group></Col>
                        </Row>

                        <Form.Group className="mt-3">
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control as="textarea" rows={2} name="observaciones" value={formData.observaciones} onChange={handleChangeForm} />
                        </Form.Group>

                        <div className="mt-4 text-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button type="submit">Guardar</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MisClases;
