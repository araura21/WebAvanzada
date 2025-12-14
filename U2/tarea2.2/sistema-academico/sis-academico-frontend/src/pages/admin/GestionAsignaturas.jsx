import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { validarTexto } from '../../utils/validations';

const GestionAsignaturas = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        descripcion: '',
        docenteId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [resAsig, resUsers] = await Promise.all([
                fetch('http://localhost:3000/api/asignaturas', { headers }),
                fetch('http://localhost:3000/api/users', { headers })
            ]);

            if (resAsig.ok) setAsignaturas(await resAsig.json());
            if (resUsers.ok) {
                const users = await resUsers.json();
                // Filtrar solo docentes
                setDocentes(users.filter(u => u.rol === 'docente'));
            }

        } catch (e) {
            console.error(e);
            setError("Error al cargar datos");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (asig) => {
        setFormData({
            id: asig.id,
            nombre: asig.nombre,
            descripcion: asig.descripcion || '',
            docenteId: asig.usuarioId || '' // Map usuarioId to form's docenteId
        });
        setShowModal(true);
        setError(null);
        setSuccess(null);
    };

    const handleNew = () => {
        setFormData({ id: null, nombre: '', descripcion: '', docenteId: '' });
        setShowModal(true);
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!validarTexto(formData.nombre)) {
            setError("El nombre contiene caracteres no permitidos");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const method = formData.id ? 'PUT' : 'POST';
            const url = formData.id
                ? `http://localhost:3000/api/asignaturas/${formData.id}`
                : 'http://localhost:3000/api/asignaturas';

            const payload = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                docenteId: formData.docenteId || null // Send null if empty string
            };

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al guardar');
            }

            setSuccess(formData.id ? 'Asignatura actualizada' : 'Asignatura creada');
            setShowModal(false);
            fetchData();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta asignatura?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:3000/api/asignaturas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const getDocenteName = (id) => {
        const doc = docentes.find(d => d.id === id);
        return doc ? `${doc.usuario} (Docente)` : 'Sin Asignar';
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Asignaturas</h2>
                <Button onClick={handleNew}>
                    <i className="bi bi-plus-lg mr-2"></i> Nueva Asignatura
                </Button>
            </div>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <Table hover responsive className="m-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Docente Asignado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asignaturas.map(a => (
                                <tr key={a.id}>
                                    <td>{a.nombre}</td>
                                    <td>{a.descripcion}</td>
                                    <td>
                                        <Badge bg={a.usuarioId ? 'info' : 'secondary'}>
                                            {getDocenteName(a.usuarioId)}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(a)}>
                                            <i className="bi bi-pencil"></i>
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(a.id)}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{formData.id ? 'Editar Asignatura' : 'Nueva Asignatura'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Docente Encargado</Form.Label>
                            <Form.Select name="docenteId" value={formData.docenteId} onChange={handleChange}>
                                <option value="">-- Seleccionar Docente --</option>
                                {docentes.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.usuario}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GestionAsignaturas;
