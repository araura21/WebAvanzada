import Docente from "../models/docente.model.js";
import Usuario from "../models/auth.model.js";
import { Op } from "sequelize";

// Listar todos los docentes activos
export const getDocentes = async (req, res) => {
  try {
    const docentes = await Docente.findAll({
      where: { estado: "activo" }
    });
    res.json(docentes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener docentes", error });
  }
};

export const getDocenteByUsuario = async (req, res) => {
  const { usuario } = req.params;
  try {
    // 1. Intentar buscar por correo o cedula (directo en Docente)
    let docente = await Docente.findOne({
      where: {
        [Op.or]: [
          { correo: usuario },
          { cedula: usuario }
        ],
        estado: 'activo'
      }
    });

    // 2. Si no encuentra, buscar por el nombre de usuario (relación Usuario)
    if (!docente) {
      docente = await Docente.findOne({
        include: [{
          model: Usuario,
          as: 'usuario',
          where: { usuario: usuario }
        }],
        where: { estado: 'activo' }
      });
    }

    if (!docente) {
      return res.status(404).json({ message: "Docente no encontrado para este usuario" });
    }

    res.json(docente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar perfil", error });
  }
};

// Obtener un docente por ID
export const getDocenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const docente = await Docente.findByPk(id);
    if (!docente) return res.status(404).json({ message: "Docente no encontrado" });
    res.json(docente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el docente", error });
  }
};

// Crear un nuevo docente
export const createDocente = async (req, res) => {
  try {
    const { cedula, nombres, apellidos, correo, especialidad, telefono } = req.body;

    // Verificar si ya existe
    const existe = await Docente.findOne({ where: { cedula } });
    if (existe) return res.status(400).json({ message: "La cédula ya está registrada" });

    const nuevoDocente = await Docente.create({
      cedula, nombres, apellidos, correo, especialidad, telefono
    });

    res.status(201).json(nuevoDocente);
  } catch (error) {
    res.status(500).json({ message: "Error al crear docente", error });
  }
};

// Actualizar docente
export const updateDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const docente = await Docente.findByPk(id);

    if (!docente) return res.status(404).json({ message: "Docente no encontrado" });

    await docente.update(req.body);
    res.json({ message: "Docente actualizado correctamente", docente });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar docente", error });
  }
};

// Eliminar docente (Lógico)
export const deleteDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const docente = await Docente.findByPk(id);

    if (!docente) return res.status(404).json({ message: "Docente no encontrado" });

    // Eliminación lógica: cambiamos estado a inactivo
    await docente.update({ estado: "inactivo" });
    res.json({ message: "Docente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar docente", error });
  }
};
