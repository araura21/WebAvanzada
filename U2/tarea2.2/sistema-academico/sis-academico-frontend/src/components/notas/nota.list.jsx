import React, { useEffect, useState } from 'react';
import { getNotas, deleteNota } from '../../services/nota.service';
import { Link } from 'react-router-dom';

const NotaList = () => {
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotas = async () => {
        try {
            const data = await getNotas();
            setNotas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotas();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta nota?")) {
            try {
                await deleteNota(id);
                fetchNotas();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Notas</h2>
                <Link to="/notas/crear" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>Registrar Nota
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>Estudiante</th>
                                    <th>Asignatura</th>
                                    <th>Parcial</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notas.length > 0 ? (
                                    notas.map((nota) => (
                                        <tr key={nota.id}>
                                            <td>{nota.Estudiante ? `${nota.Estudiante.nombres} ${nota.Estudiante.apellidos}` : 'N/A'}</td>
                                            <td>{nota.Asignatura ? nota.Asignatura.nombre : 'N/A'}</td>
                                            <td>{nota.parcial}</td>
                                            <td>
                                                <span className={`badge ${nota.total_parcial >= 14 ? 'bg-success' : 'bg-danger'}`}>
                                                    {nota.total_parcial} / 20
                                                </span>
                                            </td>
                                            <td>{nota.estado}</td>
                                            <td>
                                                <Link to={`/notas/editar/${nota.id}`} className="btn btn-sm btn-warning me-2">
                                                    <i className="bi bi-pencil"></i>
                                                </Link>
                                                <button onClick={() => handleDelete(nota.id)} className="btn btn-sm btn-danger">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No hay notas registradas</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotaList;
