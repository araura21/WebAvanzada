import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Table, Row, Col } from 'react-bootstrap';

const GestionMatriculas = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [selectedAsignatura, setSelectedAsignatura] = useState('');
    const [estudiantes, setEstudiantes] = useState([]); // Estudiantes ya matriculados
    const [busqueda, setBusqueda] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        let user = null;
        try {
            user = JSON.parse(storedUser);
        } catch (e) {
            // Si falla, es porque es un string plano (el username)
            user = { usuario: storedUser };
        }

        if (user) {
            setUserInfo(user);
            // Si es objeto tiene .usuario, si fue string plano lo asignamos a .usuario
            const username = user.usuario || user;
            fetchAsignaturasDocente(username);
        }
    }, []);

    useEffect(() => {
        if (selectedAsignatura) {
            fetchEstudiantesMatriculados(selectedAsignatura);
        } else {
            setEstudiantes([]);
        }
    }, [selectedAsignatura]);

    // 1. Obtener Asignaturas del Docente
    // 1. Obtener Asignaturas del Docente
    const fetchAsignaturasDocente = async (usuario) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // 1. Buscar el ID del usuario actual (porque login solo guarda username)
            const resUsers = await fetch('http://localhost:3000/api/users', { headers });
            const users = await resUsers.json();
            const currentUser = users.find(u => u.usuario === usuario);

            if (currentUser) {
                // 2. Traer todas las asignaturas
                const resAsig = await fetch('http://localhost:3000/api/asignaturas', { headers });
                const dataAsig = await resAsig.json();

                // 3. Filtrar las mías
                const misAsignaturas = dataAsig.filter(a => a.usuarioId === currentUser.id);
                setAsignaturas(misAsignaturas);
            }
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar las asignaturas");
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

    const handleSearch = async () => {
        if (busqueda.length < 3) return;
        try {
            const res = await fetch(`http://localhost:3000/api/estudiantes/buscar/${busqueda}`);
            const data = await res.json();
            // Filtrar los que ya están matriculados
            const idsMatriculados = estudiantes.map(e => e.id);
            const disponibles = data.filter(e => !idsMatriculados.includes(e.id) && e.estado === 'activo');
            setResultadosBusqueda(disponibles);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInscribir = async (estudianteId) => {
        if (!selectedAsignatura) {
            setError("Seleccione una asignatura primero");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/matriculas/inscribir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    estudianteId,
                    asignaturaId: selectedAsignatura,
                    periodo: '2024-2025'
                })
            });

            if (res.ok) {
                setSuccess("Estudiante inscrito exitosamente");
                fetchEstudiantesMatriculados(selectedAsignatura);
                setResultadosBusqueda(resultadosBusqueda.filter(e => e.id !== estudianteId));
                setTimeout(() => setSuccess(null), 3000);
            } else {
                const err = await res.json();
                setError(err.mensaje);
            }
        } catch (err) {
            setError("Error al inscribir");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Matrículas (Mis Clases)</h2>
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            <Row className="mb-4">
                <Col md={6}>
                    <Card>
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
                            {asignaturas.length === 0 && <p className="text-muted mt-2">No tienes asignaturas asignadas.</p>}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-success text-white">2. Buscar Estudiante para Inscribir</Card.Header>
                        <Card.Body>
                            <div className="d-flex gap-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Cédula o Apellidos..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    disabled={!selectedAsignatura}
                                />
                                <Button onClick={handleSearch} disabled={!selectedAsignatura}>Buscar</Button>
                            </div>

                            {resultadosBusqueda.length > 0 && (
                                <div className="mt-3 list-group">
                                    {resultadosBusqueda.map(est => (
                                        <div key={est.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{est.apellidos} {est.nombres} ({est.cedula})</span>
                                            <Button size="sm" onClick={() => handleInscribir(est.id)}>Inscribir</Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card>
                <Card.Header>Estudiantes Matriculados en la Asignatura Seleccionada</Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Cédula</th>
                                <th>Apellidos</th>
                                <th>Nombres</th>
                                <th>Correo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes.map(est => (
                                <tr key={est.matriculaId || est.id}>
                                    <td>{est.cedula}</td>
                                    <td>{est.apellidos}</td>
                                    <td>{est.nombres}</td>
                                    <td>{est.correo}</td>
                                </tr>
                            ))}
                            {estudiantes.length === 0 && (
                                <tr><td colSpan="4" className="text-center">No hay estudiantes matriculados aún.</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default GestionMatriculas;
