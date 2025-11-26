import express from 'express';
import ClienteController from '../controllers/cliente.controller.js';

const router = express.Router();

// Endpoint: POST /api/clientes/calcular
router.post('/calcular', ClienteController.calcular);

// Endpoint: GET /api/clientes (Historial)
router.get('/', ClienteController.obtenerTodos);

// Endpoint: GET /api/clientes/estadisticas (Reporte morosos)
router.get('/estadisticas', ClienteController.obtenerEstadisticas);

// Endpoint: GET /api/clientes/:id (Detalle cliente)
router.get('/:id', ClienteController.obtenerPorId);

export default router;
