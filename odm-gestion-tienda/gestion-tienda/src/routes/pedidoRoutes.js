import {Router} from 'express';

import{
    crearPedido,
    listarPedidos,
    obtenerPedidosPorId,
    actualizarPedido,
    eliminarPedido
} from "../controllers/pedidoController.js";

const router = Router();

router.get("/", listarPedidos);
router.post("/", crearPedido);
router.get("/:id", obtenerPedidosPorId);
router.put("/:id", actualizarPedido);
router.delete("/:id", eliminarPedido);

export default router;