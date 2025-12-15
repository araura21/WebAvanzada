import { Router } from "express";
import { createUsuarioEstudiante, createUsuarioDocente, getDashboardStats } from "../controllers/admin.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Rutas exclusivas de administrador para creación compuesta
router.get("/stats", verificarToken, esAdmin, getDashboardStats);

router.post("/estudiantes", verificarToken, esAdmin, upload.single('foto'), createUsuarioEstudiante);
router.post("/docentes", verificarToken, esAdmin, upload.single('foto'), createUsuarioDocente);

export default router;
