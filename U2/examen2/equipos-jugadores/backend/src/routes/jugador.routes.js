import { Router } from "express";
import {
  listarTodos,
  listarPorEquipo,
  crearJugador,
  actualizarJugador,
  eliminarJugador,
} from "../controllers/jugador.controller.js";

const router = Router();

router.get("/", listarTodos);
router.get("/equipo/:equipoId", listarPorEquipo);
router.post("/", crearJugador);
router.put("/:id", actualizarJugador);
router.delete("/:id", eliminarJugador);

export default router;
