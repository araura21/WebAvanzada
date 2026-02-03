import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';

const GestionDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Formulario unificado
    const [formData, setFormData] = useState({
        usuario: '',
        password: '',
        cedula: '',
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        especialidad: '',
        foto: null
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDocentes();
    }, []);

    const fetchDocentes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/docentes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const docentesData = Array.isArray(data) ? data : (data.data || []);
            setDocentes(docentesData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'foto') {
            setFormData({ ...formData, foto: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const token = localStorage.getItem('token');

            const data = new FormData();
            data.append('usuario', formData.usuario);
            data.append('password', formData.password);
            data.append('cedula', formData.cedula);
            data.append('nombres', formData.nombres);
            data.append('apellidos', formData.apellidos);
            data.append('correo', formData.correo);
            data.append('telefono', formData.telefono);
            data.append('especialidad', formData.especialidad);
            if (formData.foto) {
                data.append('foto', formData.foto);
            }

            const res = await fetch('http://localhost:3000/api/admin/docentes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const responseData = await res.json();

            if (res.ok) {
                setMessage("Docente y Usuario creados exitosamente");
                fetchDocentes();
                setShowModal(false);
                setFormData({ usuario: '', password: '', cedula: '', nombres: '', apellidos: '', correo: '', telefono: '', especialidad: '', foto: null });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setError(responseData.message || "Error al crear docente");
            }
        } catch (err) {
            setError("Error de conexión");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Docentes (Admin)</h2>
                <Button onClick={() => setShowModal(true)}>Nuevo Docente</Button>
            </div>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Cédula</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Correo</th>
                        <th>Especialidad</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {docentes.map(doc => (
                        <tr key={doc.id}>
                            <td>{doc.cedula}</td>
                            <td>{doc.nombres}</td>
                            <td>{doc.apellidos}</td>
                            <td>{doc.correo}</td>
                            <td>{doc.especialidad}</td>
                            <td>{doc.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Nuevo Docente + Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <h5 className="text-primary">1. Credenciales de Acceso</h5>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Form.Label>Usuario (Login)</Form.Label>
                                <Form.Control name="usuario" value={formData.usuario} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        <h5 className="text-success mt-4">2. Información del Docente</h5>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Form.Label>Cédula</Form.Label>
                                <Form.Control name="cedula" value={formData.cedula} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Form.Label>Nombres</Form.Label>
                                <Form.Control name="nombres" value={formData.nombres} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control name="telefono" value={formData.telefono} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <Form.Label>Especialidad</Form.Label>
                                <Form.Control name="especialidad" value={formData.especialidad} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="mb-3">
                            <Form.Label>Foto de Perfil</Form.Label>
                            <Form.Control type="file" name="foto" onChange={handleChange} accept="image/*" />
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button variant="primary" type="submit">Guardar Registro</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GestionDocentes;
