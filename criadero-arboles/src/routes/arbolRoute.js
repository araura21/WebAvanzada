import express from 'express';
import {
  crearArbol,
  listarArboles,
  buscarArbolId,
  actualizarArbol,
  eliminarArbol,
  calcularPrecioArbol
} from '../controllers/arbolController.js';

const router = express.Router();

// Rutas REST para /api/arboles
router.get('/', listarArboles);
router.get('/:id', buscarArbolId);
router.post('/', crearArbol);
router.put('/:id', actualizarArbol);
router.delete('/:id', eliminarArbol);

// Ruta para cálculo de precio con descuentos e IVA
router.post('/calcular', calcularPrecioArbol);

export default router;

