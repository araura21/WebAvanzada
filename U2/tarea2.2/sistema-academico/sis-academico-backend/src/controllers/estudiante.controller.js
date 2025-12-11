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
    const { cedula, nombres, apellidos, correo, telefono, curso, paralelo } = req.body;

    // Validaciones
    if (!cedula || !nombres || !apellidos || !correo) {
      return res.status(400).json({ 
        mensaje: "Campos requeridos: cedula, nombres, apellidos, correo" 
      });
    }

    const data = {
      cedula: cedula.trim(),
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      correo: correo.trim().toLowerCase(),
      telefono: telefono || null,
      curso: curso || null,
      paralelo: paralelo || null,
      estado: "activo"
    };

    // Verificar si hay archivo de foto
    if (req.file) {
      data.foto = "uploads/estudiantes/" + req.file.filename;
    }

    // Crear el estudiante en la BD
    const nuevo = await Estudiante.create(data);
    
    res.status(201).json({ 
      mensaje: "Estudiante registrado exitosamente",
      id: nuevo.id,
      estudiante: nuevo 
    });
  } catch (error) {
    console.error("Error al crear estudiante:", error);
    
    // Manejar errores específicos de validación
    if (error.name === "SequelizeUniqueConstraintError") {
      const campo = error.errors[0].path;
      return res.status(400).json({ 
        mensaje: `El ${campo} ya existe en la base de datos` 
      });
    }

    res.status(500).json({ 
      mensaje: "Error al crear estudiante", 
      error: error.message 
    });
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
