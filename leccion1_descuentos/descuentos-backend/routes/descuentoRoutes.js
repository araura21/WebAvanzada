import { Router } from "express";
import cors from "cors";
import {
  crearDescuento,
  listarDescuentos,
  buscarDescuentoPorId,
  actualizarDescuento,
  eliminarDescuento,
  calcularDescuentoFinal
} from "../controllers/descuentoController.js";

const router = Router();

// Rutas CRUD
router.post("/", crearDescuento);
router.get("/", listarDescuentos);
router.get("/:id", buscarDescuentoPorId);
router.put("/:id", actualizarDescuento);
router.delete("/:id", eliminarDescuento);

// Ruta especial para calcular el descuento aplicado
router.get("/:id/calcular", calcularDescuentoFinal);

export default router;
