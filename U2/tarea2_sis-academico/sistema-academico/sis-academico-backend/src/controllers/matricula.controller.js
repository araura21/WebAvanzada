import Matricula from "../models/matricula.model.js";
import Estudiante from "../models/estudiante.model.js";
import { Asignatura } from "../models/asignatura.model.js";
import { Op } from "sequelize";

// Inscribir estudiante en asignatura
export const inscribirEstudiante = async (req, res) => {
    try {
        const { estudianteId, asignaturaId, periodo } = req.body;

        // Verificar si ya existe
        const existe = await Matricula.findOne({
            where: {
                estudianteId,
                asignaturaId,
                estado: 'cursando'
            }
        });

        if (existe) {
            return res.status(400).json({ mensaje: "El estudiante ya está matriculado en esta asignatura." });
        }

        const nueva = await Matricula.create({
            estudianteId,
            asignaturaId,
            periodo: periodo || '2024-2025'
        });

        res.status(201).json({ mensaje: "Estudiante matriculado exitosamente", matricula: nueva });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al matricular", error });
    }
};

// Obtener lista de estudiantes por asignatura (Para el docente)
export const getEstudiantesPorAsignatura = async (req, res) => {
    const { asignaturaId } = req.params;
    try {
        const matriculas = await Matricula.findAll({
            where: { asignaturaId },
            include: [
                {
                    model: Estudiante,
                    attributes: ['id', 'nombres', 'apellidos', 'cedula', 'correo']
                }
            ]
        });

        // Retornamos la lista limpida de estudiantes
        const estudiantes = matriculas.map(m => ({
            matriculaId: m.id,
            ...m.Estudiante.dataValues
        }));

        res.json(estudiantes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener lista de clase", error });
    }
};

// Obtener asignaturas de un estudiante (Historial)
export const getAsignaturasPorEstudiante = async (req, res) => {
    const { estudianteId } = req.params;
    try {
        const matriculas = await Matricula.findAll({
            where: { estudianteId },
            include: [{ model: Asignatura }]
        });
        res.json(matriculas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al historial", error });
    }
};
