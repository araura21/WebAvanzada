import Nota from "../models/nota.model.js";
import Estudiante from "../models/estudiante.model.js";
import Docente from "../models/docente.model.js";
import { Asignatura } from "../models/asignatura.model.js";

// Listar todas las notas (con filtros opcionales)
export const getNotas = async (req, res) => {
  try {
    const { estudianteId, docenteId, asignaturaId, parcial } = req.query;

    const whereClause = { estado: "activo" };
    if (estudianteId) whereClause.estudianteId = estudianteId;
    if (docenteId) whereClause.docenteId = docenteId;
    if (asignaturaId) whereClause.asignaturaId = asignaturaId;
    if (parcial) whereClause.parcial = parcial;

    const notas = await Nota.findAll({
      where: whereClause,
      include: [
        { model: Estudiante, attributes: ["nombres", "apellidos", "cedula"] },
        { model: Docente, attributes: ["nombres", "apellidos"] },
        { model: Asignatura, attributes: ["nombre"] }
      ],
      order: [["updatedAt", "DESC"]]
    });
    res.json(notas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notas", error });
  }
};

// Obtener una nota por ID
export const getNotaById = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await Nota.findByPk(id, {
      include: [
        { model: Estudiante, attributes: ["nombres", "apellidos"] },
        { model: Asignatura, attributes: ["nombre"] }
      ]
    });
    if (!nota) return res.status(404).json({ message: "Nota no encontrada" });
    res.json(nota);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la nota", error });
  }
};

// Crear una nueva nota
export const createNota = async (req, res) => {
  try {
    const {
      estudianteId, asignaturaId, docenteId, parcial,
      nota_tarea, nota_informe, nota_leccion, nota_examen,
      observaciones
    } = req.body;

    // Validaciones básicas
    if (!estudianteId || !asignaturaId || !parcial) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Verificar si ya existe una nota para ese estudiante, asignatura y parcial
    const existe = await Nota.findOne({
      where: { estudianteId, asignaturaId, parcial, estado: "activo" }
    });

    if (existe) {
      return res.status(400).json({ message: "El estudiante ya tiene nota registrada para este parcial y asignatura" });
    }

    const nuevaNota = await Nota.create({
      estudianteId, asignaturaId, docenteId, parcial,
      nota_tarea, nota_informe, nota_leccion, nota_examen,
      observaciones
    });

    res.status(201).json(nuevaNota);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar nota", error });
  }
};

// Actualizar nota
export const updateNota = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await Nota.findByPk(id);

    if (!nota) return res.status(404).json({ message: "Nota no encontrada" });

    await nota.update(req.body);
    res.json({ message: "Nota actualizada correctamente", nota });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar nota", error });
  }
};

// Eliminar nota (Lógico)
export const deleteNota = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await Nota.findByPk(id);

    if (!nota) return res.status(404).json({ message: "Nota no encontrada" });

    await nota.update({ estado: "inactivo" });
    res.json({ message: "Nota eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar nota", error });
  }
};
