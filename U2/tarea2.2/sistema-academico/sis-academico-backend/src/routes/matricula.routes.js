import { Router } from "express";
import { inscribirEstudiante, getEstudiantesPorAsignatura, getAsignaturasPorEstudiante } from "../controllers/matricula.controller.js";
import { verificarToken, esDocente } from "../middlewares/auth.middleware.js";

const router = Router();

// Inscribir (Docente)
router.post("/inscribir", verificarToken, esDocente, inscribirEstudiante);

// Estudiantes por Asignatura (Docente)
router.get("/clase/:asignaturaId", verificarToken, esDocente, getEstudiantesPorAsignatura);

// Asignaturas por Estudiante (Historial - Publico/Auth)
router.get("/historial/:estudianteId", verificarToken, getAsignaturasPorEstudiante);

export default router;
