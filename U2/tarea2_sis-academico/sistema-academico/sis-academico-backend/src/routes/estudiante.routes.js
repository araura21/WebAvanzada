// src/routes/estudiante.routes.js
import { Router } from "express";
import {
  obtenerEstudiantes,
  buscarEstudiante,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
  getEstudianteByUsuario
} from "../controllers/estudiante.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Rutas públicas (sin autenticación)
router.get("/", obtenerEstudiantes);
router.get("/perfil/:usuario", getEstudianteByUsuario);
router.get("/buscar/:termino", buscarEstudiante);
router.post(
  "/",
  upload.single("foto"),
  crearEstudiante
);

// Rutas protegidas (con autenticación y multer para upload de foto)

router.put("/:id", verificarToken, actualizarEstudiante);
router.delete("/:id", verificarToken, eliminarEstudiante);

export default router;
