import { Router } from "express";
import {
  listarEquipos,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo,
} from "../controllers/equipo.controller.js";

const router = Router();

router.get("/", listarEquipos);
router.post("/", crearEquipo);
router.put("/:id", actualizarEquipo);
router.delete("/:id", eliminarEquipo);

export default router;
