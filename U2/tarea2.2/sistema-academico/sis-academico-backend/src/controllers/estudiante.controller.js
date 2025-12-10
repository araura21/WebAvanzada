// src/controllers/estudiante.controller.js
import Estudiante from "../models/estudiante.model.js";
import { Op } from "sequelize";

export const obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll({
      where: { estado: "activo" }
    });
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener estudiantes", error });
  }
};

export const buscarEstudiante = async (req, res) => {
  const { termino } = req.params;

  try {
    const resultados = await Estudiante.findAll({
      where: {
        [Op.or]: [
          { cedula: { [Op.like]: `%${termino}%` } },
          { nombres: { [Op.like]: `%${termino}%` } },
          { apellidos: { [Op.like]: `%${termino}%` } }
        ] 
      }
    });

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ mensaje: "Error en la búsqueda", error });
  }
};

export const crearEstudiante = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.foto = "uploads/estudiantes/" + req.file.filename;
    }

    const nuevo = await Estudiante.create(data);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear estudiante", error });
  }
};


export const actualizarEstudiante = async (req, res) => {
  const { id } = req.params;

  try {
    const estudiante = await Estudiante.findByPk(id);

    if (!estudiante)
      return res.status(404).json({ mensaje: "Estudiante no encontrado" });

    await estudiante.update(req.body);

    res.json({ mensaje: "Estudiante actualizado", estudiante });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar", error });
  }
};

export const eliminarEstudiante = async (req, res) => {
  const { id } = req.params;

  try {
    const estudiante = await Estudiante.findByPk(id);

    if (!estudiante)
      return res.status(404).json({ mensaje: "Estudiante no encontrado" });

    await estudiante.update({ estado: "inactivo" });

    res.json({ mensaje: "Estudiante eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar", error });
  }
};
