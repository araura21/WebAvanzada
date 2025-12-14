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
    const nueva = await Asignatura.create({ nombre, descripcion });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: "Error al crear asignatura", error });
  }
};
