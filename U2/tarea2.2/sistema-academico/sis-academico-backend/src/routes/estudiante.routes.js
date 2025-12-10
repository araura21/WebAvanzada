// src/routes/estudiante.routes.js
import { Router } from "express";
import {
  obtenerEstudiantes,
  buscarEstudiante,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
} from "../controllers/estudiante.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";


const router = Router();
import upload from "../config/multer.js";

router.post(
  "/",
  upload.single("foto"),
  crearEstudiante
);
router.get("/", obtenerEstudiantes);
router.get("/buscar/:termino", buscarEstudiante);

router.get("/", verificarToken, obtenerEstudiantes);
router.post("/", verificarToken, crearEstudiante);

router.put("/:id", actualizarEstudiante);
router.delete("/:id", eliminarEstudiante);

export default router;
