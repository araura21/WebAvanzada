import {Router} from 'express';

import{
    crearProducto,
    listarProductos,
    obtenerProductosPorId,
    actualizarProducto,
    eliminarProducto
} from "../controllers/productoController.js";

const router = Router();

router.get("/", listarProductos);
router.post("/", crearProducto);
router.get("/:id", obtenerProductosPorId);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

export default router;

