// src/routes/arboles.routes.js

const express = require("express");
const router = express.Router();

const {
  obtenerPrecios,
  calcularTotal
} = require("../controllers/arboles.controller.js");

// Ruta para obtener precios de árboles
router.get("/precios", obtenerPrecios);

// Ruta para calcular total a pagar
router.post("/calcular", calcularTotal);

module.exports = router;
