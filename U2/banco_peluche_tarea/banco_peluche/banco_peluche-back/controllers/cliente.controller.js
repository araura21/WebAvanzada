import Cliente from '../models/Cliente.js';
import clienteService from '../services/cliente.service.js';

class ClienteController {

  static async calcular(req, res) {
    try {
      const { nombre, cedula, telefono, saldoAnterior, montoCompras, pagoRealizado } = req.body;

      // Validaciones básicas
      if (saldoAnterior < 0 || montoCompras < 0 || pagoRealizado < 0) {
        return res.status(400).json({ ok: false, msg: "Los valores no pueden ser negativos" });
      }
      if (isNaN(saldoAnterior) || isNaN(montoCompras) || isNaN(pagoRealizado)) {
        return res.status(400).json({ ok: false, msg: "Los valores deben ser numéricos" });
      }
      if (!nombre || !cedula || !telefono) {
        return res.status(400).json({ ok: false, msg: "Nombre, cédula y teléfono son requeridos" });
      }

      // Calcular datos
      const calculo = clienteService.calcularCliente({ saldoAnterior, montoCompras, pagoRealizado });

      // Guardar en Base de Datos
      const nuevoCliente = await Cliente.create({
        nombre,
        cedula,
        telefono,
        ...calculo
      });

      res.json({
        ok: true,
        data: nuevoCliente
      });

    } catch (err) {
      console.error("Error calcular:", err);
      res.status(500).json({ ok: false, msg: "Error interno al calcular datos del cliente" });
    }
  }

  static async obtenerTodos(req, res) {
    try {
      const clientes = await Cliente.findAll({ order: [['createdAt', 'DESC']] });
      res.json({ ok: true, data: clientes });
    } catch (err) {
      console.error("Error obtenerTodos:", err);
      res.status(500).json({ ok: false, msg: "Error al obtener clientes" });
    }
  }

  static async obtenerEstadisticas(req, res) {
    try {
      const totalClientes = await Cliente.count();
      const morosos = await Cliente.count({ where: { esMoroso: true } });
      const gananciaIntereses = await Cliente.sum('interes', { where: { esMoroso: true } }) || 0;

      res.json({
        ok: true,
        data: {
          totalClientes,
          morosos,
          gananciaIntereses
        }
      });
    } catch (err) {
      console.error("Error obtenerEstadisticas:", err);
      res.status(500).json({ ok: false, msg: "Error al obtener estadísticas" });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findByPk(id);
      if (!cliente) {
        return res.status(404).json({ ok: false, msg: "Cliente no encontrado" });
      }
      res.json({ ok: true, data: cliente });
    } catch (err) {
      console.error("Error obtenerPorId:", err);
      res.status(500).json({ ok: false, msg: "Error al obtener cliente" });
    }
  }
}

export default ClienteController;
