import {Router} from 'express';

import {
  calcularCompraArboles,
  listarComprasArboles,
  obtenerCompraArbolPorId,
  actualizarCompraArbol,
  eliminarCompraArbol
} from '../controllers/arbolController.js';

const router = Router();

// POST - Calcular y crear compra
router.post('/calcular', calcularCompraArboles);

// GET - Listar todas las compras
router.get('/', listarComprasArboles);

// GET - Obtener compra por ID
router.get('/:id', obtenerCompraArbolPorId);

// PUT - Actualizar compra
router.put('/:id', actualizarCompraArbol);

// DELETE - Eliminar compra
router.delete('/:id', eliminarCompraArbol);

export default router;

