import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { validarCedula, validarTexto, validarEmail } from '../../utils/validations';

const GestionEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        cedula: '', nombres: '', apellidos: '', correo: '', telefono: '', curso: '', paralelo: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch estudiantes
    const fetchEstudiantes = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/estudiantes');
            const data = await res.json();
            setEstudiantes(data);
        } catch (err) {
            setError('Error al cargar estudiantes');
        }
    };

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // VALIDACIONES
        if (!validarCedula(formData.cedula)) {
            setError("La cédula ingresada no es válida (Verifique 10 dígitos y formato Ecuador)");
            setLoading(false);
            return;
        }

        if (!validarTexto(formData.nombres) || !validarTexto(formData.apellidos)) {
            setError("Nombres/Apellidos contienen caracteres inválidos");
            setLoading(false);
            return;
        }

        if (!validarEmail(formData.correo)) {
            setError("El correo electrónico no tiene un formato válido");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            if (editing) {
                // Update (JSON)
                const res = await fetch(`http://localhost:3000/api/estudiantes/${currentId}`, {
                    method: 'PUT',
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!res.ok) throw new Error('Error al actualizar');
                setSuccess('Estudiante actualizado correctamente');

            } else {
                // Create (FormData)
                const data = new FormData();
                Object.keys(formData).forEach(key => data.append(key, formData[key]));
                if (file) data.append('foto', file);

                const res = await fetch('http://localhost:3000/api/estudiantes', {
                    method: 'POST',
                    body: data
                    // No headers Content-Type manually set for FormData, fetch does it
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.mensaje || 'Error al crear');
                }
                setSuccess('Estudiante creado correctamente');
            }

            setShowModal(false);
            fetchEstudiantes();
            resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este estudiante?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Error al eliminar');
            fetchEstudiantes();
            setSuccess('Estudiante eliminado');
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData({ cedula: '', nombres: '', apellidos: '', correo: '', telefono: '', curso: '', paralelo: '' });
        setFile(null);
        setEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (est) => {
        setFormData({
            cedula: est.cedula,
            nombres: est.nombres,
            apellidos: est.apellidos,
            correo: est.correo,
            telefono: est.telefono || '',
            curso: est.curso || '',
            paralelo: est.paralelo || ''
        });
        setCurrentId(est.id);
        setEditing(true);
        setShowModal(true);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Estudiantes</h2>
                <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    <i className="bi bi-plus-lg mr-2"></i> Nuevo Estudiante
                </Button>
            </div>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Cédula</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Curso</th>
                        <th>Paralelo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(est => (
                        <tr key={est.id}>
                            <td>{est.cedula}</td>
                            <td>{est.nombres}</td>
                            <td>{est.apellidos}</td>
                            <td>{est.curso || '-'}</td>
                            <td>{est.paralelo || '-'}</td>
                            <td>
                                <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(est)}>
                                    <i className="bi bi-pencil"></i>
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(est.id)}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Editar Estudiante' : 'Nuevo Estudiante'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Cédula</Form.Label>
                            <Form.Control type="text" name="cedula" value={formData.cedula} onChange={handleChange} required disabled={editing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                        </Form.Group>
                        <div className="row">
                            <div className="col-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Curso</Form.Label>
                                    <Form.Control type="text" name="curso" value={formData.curso} onChange={handleChange} />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Paralelo</Form.Label>
                                    <Form.Select name="paralelo" value={formData.paralelo} onChange={handleChange}>
                                        <option value="">Seleccione...</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        {!editing && (
                            <Form.Group className="mb-3">
                                <Form.Label>Foto</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group>
                        )}

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

export default GestionEstudiantes;
