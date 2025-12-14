import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { validarCedula, validarTexto, validarPassword } from '../../utils/validations';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        usuario: '',
        password: '',
        rol: 'estudiante'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsuarios(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // VALIDACIONES
        if (!validarTexto(formData.usuario)) {
            setError("El usuario contiene caracteres no permitidos");
            setLoading(false);
            return;
        }

        // Si es estudiante/docente, se recomienda que sea cédula
        if (formData.rol !== 'admin') {
            // Opcional: validar que el usuario parezca una cédula o correo
            // validación laxa para no bloquear correos
        }

        if (!validarPassword(formData.password)) {
            setError("La contraseña debe tener al menos 6 caracteres");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al crear usuario');
            }

            setSuccess('Usuario creado correctamente');
            setShowModal(false);
            setFormData({ usuario: '', password: '', rol: 'estudiante' });
            fetchUsuarios();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro de eliminar este usuario?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:3000/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchUsuarios();
        } catch (e) {
            console.error(e);
        }
    };

    const handleReactivate = async (id) => {
        if (!window.confirm('¿Desea reactivar este usuario?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/users/${id}/activate`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setSuccess("Usuario reactivado correctamente");
                fetchUsuarios();
            } else {
                throw new Error("No se pudo reactivar");
            }
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Usuarios</h2>
                {/*<Button onClick={() => setShowModal(true)}>
                    <i className="bi bi-person-plus mr-2"></i> Nuevo Usuario
                </Button>*/}
            </div>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <Table hover responsive className="m-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Usuario / Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Creación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(u => (
                                <tr key={u.id}>
                                    <td>{u.usuario}</td>
                                    <td>
                                        <Badge bg={
                                            u.rol === 'admin' ? 'danger' :
                                                u.rol === 'docente' ? 'warning' : 'info'
                                        }>
                                            {u.rol.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg={!u.estado ? 'secondary' : 'success'}>
                                            {u.estado ? 'ACTIVO' : 'INACTIVO'}
                                        </Badge>
                                    </td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {!u.estado ? (
                                            <Button variant="outline-success" size="sm" onClick={() => handleReactivate(u.id)} title="Reactivar Usuario">
                                                <i className="bi bi-arrow-counterclockwise"></i>
                                            </Button>
                                        ) : (
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u.id)} title="Eliminar Usuario">
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario / Correo / Cédula</Form.Label>
                            <Form.Control
                                type="text"
                                name="usuario"
                                value={formData.usuario}
                                onChange={handleChange}
                                placeholder="Ej: admin o 1723456789"
                                required
                            />
                            <Form.Text className="text-muted">
                                Para estudiantes/docentes, use la Cédula o Correo.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select name="rol" value={formData.rol} onChange={handleChange}>
                                <option value="estudiante">Estudiante</option>
                                <option value="docente">Docente</option>
                                <option value="admin">Administrador</option>
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Creando...' : 'Crear Usuario'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GestionUsuarios;
