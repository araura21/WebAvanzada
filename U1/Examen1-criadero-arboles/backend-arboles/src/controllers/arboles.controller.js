// src/controllers/arboles.controller.js

const { preciosArboles, calcularTotalCompra } = require("../models/arboles.model.js");

// GET /api/arboles/precios
function obtenerPrecios(req, res) {
  res.json({
    ok: true,
    data: preciosArboles
  });
}

// POST /api/arboles/calcular
function calcularTotal(req, res) {
  try {
    const { paltos = 0, limones = 0, chirimoyos = 0 } = req.body;

    // Validaciones simples
    if (paltos < 0 || limones < 0 || chirimoyos < 0) {
      return res.status(400).json({
        ok: false,
        message: "Las cantidades no pueden ser negativas."
      });
    }

    const resultado = calcularTotalCompra({ paltos, limones, chirimoyos });

    res.json({
      ok: true,
      data: resultado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
}

module.exports = {
  obtenerPrecios,
  calcularTotal
};
