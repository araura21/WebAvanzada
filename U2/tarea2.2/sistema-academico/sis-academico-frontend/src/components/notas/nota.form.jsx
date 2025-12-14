import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNota, getNotaById, updateNota } from '../../services/nota.service';
import { obtenerEstudiantes } from '../../services/estudiante.service';
import { getAsignaturas } from '../../services/asignatura.service';
import { calcularNotaParcial } from '../../utils/calculadoraNotas';

const NotaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [estudiantes, setEstudiantes] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    
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

    const [total, setTotal] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [estData, asigData] = await Promise.all([
                    obtenerEstudiantes(),
                    getAsignaturas()
                ]);
                setEstudiantes(estData);
                setAsignaturas(asigData);

                if (id) {
                    const nota = await getNotaById(id);
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
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        loadData();
    }, [id]);

    useEffect(() => {
        const calculado = calcularNotaParcial(
            formData.nota_tarea,
            formData.nota_informe,
            formData.nota_leccion,
            formData.nota_examen
        );
        setTotal(calculado);
    }, [formData.nota_tarea, formData.nota_informe, formData.nota_leccion, formData.nota_examen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateNota(id, formData);
                alert("Nota actualizada correctamente");
            } else {
                await createNota(formData);
                alert("Nota registrada correctamente");
            }
            navigate('/notas');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">{id ? 'Editar Nota' : 'Registrar Nota'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Estudiante</label>
                                <select 
                                    className="form-select" 
                                    name="estudianteId" 
                                    value={formData.estudianteId} 
                                    onChange={handleChange} 
                                    required
                                    disabled={!!id}
                                >
                                    <option value="">Seleccione...</option>
                                    {estudiantes.map(est => (
                                        <option key={est.id} value={est.id}>
                                            {est.nombres} {est.apellidos}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Asignatura</label>
                                <select 
                                    className="form-select" 
                                    name="asignaturaId" 
                                    value={formData.asignaturaId} 
                                    onChange={handleChange} 
                                    required
                                    disabled={!!id}
                                >
                                    <option value="">Seleccione...</option>
                                    {asignaturas.map(asig => (
                                        <option key={asig.id} value={asig.id}>
                                            {asig.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Parcial</label>
                                <select 
                                    className="form-select" 
                                    name="parcial" 
                                    value={formData.parcial} 
                                    onChange={handleChange}
                                    disabled={!!id}
                                >
                                    <option value="P1">Parcial 1</option>
                                    <option value="P2">Parcial 2</option>
                                    <option value="P3">Parcial 3</option>
                                </select>
                            </div>
                        </div>

                        <h5 className="mt-4 mb-3">Calificaciones (Sobre 20)</h5>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <label className="form-label">Tarea (20%)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="nota_tarea" 
                                    value={formData.nota_tarea} 
                                    onChange={handleChange} 
                                    min="0" max="20" step="0.01" required 
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Informe (20%)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="nota_informe" 
                                    value={formData.nota_informe} 
                                    onChange={handleChange} 
                                    min="0" max="20" step="0.01" required 
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Lección (20%)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="nota_leccion" 
                                    value={formData.nota_leccion} 
                                    onChange={handleChange} 
                                    min="0" max="20" step="0.01" required 
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Examen (40%)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="nota_examen" 
                                    value={formData.nota_examen} 
                                    onChange={handleChange} 
                                    min="0" max="20" step="0.01" required 
                                />
                            </div>
                        </div>

                        <div className="alert alert-info d-flex justify-content-between align-items-center">
                            <strong>Total Parcial Calculado:</strong>
                            <span className="fs-4 badge bg-primary">{total} / 20</span>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Observaciones</label>
                            <textarea 
                                className="form-control" 
                                name="observaciones" 
                                value={formData.observaciones} 
                                onChange={handleChange} 
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/notas')}>Cancelar</button>
                            <button type="submit" className="btn btn-success">Guardar Nota</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NotaForm;
