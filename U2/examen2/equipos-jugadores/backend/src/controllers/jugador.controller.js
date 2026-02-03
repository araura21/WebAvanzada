import Jugador from "../models/Jugador.js";
import Equipo from "../models/Equipo.js";

export const listarTodos = async (req, res) => {
  try {
    const jugadores = await Jugador.findAll({
      include: [{ model: Equipo }],
    });
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listarPorEquipo = async (req, res) => {
  try {
    const { equipoId } = req.params;
    const jugadores = await Jugador.findAll({
      where: { equipo_id: equipoId },
      include: [{ model: Equipo }],
    });
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const crearJugador = async (req, res) => {
  try {
    const { cedula, nombre, equipo_id } = req.body;

    if (!cedula || !nombre || !equipo_id) {
      return res.status(400).json({ message: "Cédula, nombre y equipo son requeridos" });
    }

    // Validar que la cédula sea única (no puede estar en dos equipos)
    const jugadorExistente = await Jugador.findOne({ where: { cedula } });
    if (jugadorExistente) {
      return res.status(400).json({
        message: `El jugador con cédula ${cedula} ya está registrado en el equipo ${jugadorExistente.equipo_id}`,
      });
    }

    // Validar que el equipo exista
    const equipo = await Equipo.findByPk(equipo_id);
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    const jugador = await Jugador.create({ cedula, nombre, equipo_id });
    res.status(201).json({ message: "Jugador creado", jugador });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const { cedula, nombre, equipo_id } = req.body;

    const jugador = await Jugador.findByPk(id);
    if (!jugador) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    // Validar que la cédula sea única (si cambió)
    if (cedula !== jugador.cedula) {
      const jugadorExistente = await Jugador.findOne({ where: { cedula } });
      if (jugadorExistente) {
        return res.status(400).json({
          message: `La cédula ${cedula} ya está registrada para otro jugador`,
        });
      }
    }

    // Validar que el equipo exista
    const equipo = await Equipo.findByPk(equipo_id);
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    await jugador.update({ cedula, nombre, equipo_id });
    res.json({ message: "Jugador actualizado", jugador });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const jugador = await Jugador.findByPk(id);
    if (!jugador) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }
    await jugador.destroy();
    res.json({ message: "Jugador eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
