import Docente from "../models/docente.model.js";

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
