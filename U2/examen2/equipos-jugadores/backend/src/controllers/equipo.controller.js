import Equipo from "../models/Equipo.js";

export const listarEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.findAll();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const crearEquipo = async (req, res) => {
  try {
    const { codigo, nombre } = req.body;

    if (!codigo || !nombre) {
      return res.status(400).json({ message: "Código y nombre son requeridos" });
    }

    // Validar que el código sea único
    const equipoExistente = await Equipo.findOne({ where: { codigo } });
    if (equipoExistente) {
      return res.status(400).json({ message: "El código del equipo ya existe" });
    }

    const equipo = await Equipo.create({ codigo, nombre });
    res.status(201).json({ message: "Equipo creado", equipo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre } = req.body;

    const equipo = await Equipo.findByPk(id);
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    // Validar que el código sea único (si cambió)
    if (codigo !== equipo.codigo) {
      const equipoExistente = await Equipo.findOne({ where: { codigo } });
      if (equipoExistente) {
        return res.status(400).json({ message: "El código del equipo ya existe" });
      }
    }

    await equipo.update({ codigo, nombre });
    res.json({ message: "Equipo actualizado", equipo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findByPk(id);
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }
    await equipo.destroy();
    res.json({ message: "Equipo eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
