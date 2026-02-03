import { Router } from "express";
import { inscribirEstudiante, getEstudiantesPorAsignatura, getAsignaturasPorEstudiante } from "../controllers/matricula.controller.js";
import { verificarToken, esDocente, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Inscribir (Admin)
router.post("/inscribir", verificarToken, esAdmin, inscribirEstudiante);

// Estudiantes por Asignatura (Docente, Admin, Estudiante para ver compañeros)
router.get("/clase/:asignaturaId", verificarToken, getEstudiantesPorAsignatura);

// Asignaturas por Estudiante (Historial - Publico/Auth)
router.get("/historial/:estudianteId", verificarToken, getAsignaturasPorEstudiante);

export default router;
