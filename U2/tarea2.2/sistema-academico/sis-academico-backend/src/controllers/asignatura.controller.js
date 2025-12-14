import Asignatura from "../models/asignatura.model.js";

export const getAsignaturas = async (req, res) => {
  try {
    const asignaturas = await Asignatura.findAll({ where: { estado: "activo" } });
    res.json(asignaturas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener asignaturas", error });
  }
};

export const createAsignatura = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const nuevaAsignatura = await Asignatura.create({ nombre, descripcion });
    res.status(201).json(nuevaAsignatura);
  } catch (error) {
    res.status(500).json({ message: "Error al crear asignatura", error });
  }
};

export const updateAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const asignatura = await Asignatura.findByPk(id);

    if (!asignatura) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    await asignatura.update({ nombre, descripcion });
    res.json(asignatura);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar asignatura", error });
  }
};

export const deleteAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    const asignatura = await Asignatura.findByPk(id);

    if (!asignatura) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    await asignatura.update({ estado: 'inactivo' });
    res.json({ message: "Asignatura eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar asignatura", error });
  }
};
