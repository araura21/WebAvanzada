import { Router } from "express";
import { getAsignaturas, createAsignatura, updateAsignatura, deleteAsignatura } from "../controllers/asignatura.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verificarToken, getAsignaturas);
router.post("/", verificarToken, esAdmin, createAsignatura);
router.put("/:id", verificarToken, esAdmin, updateAsignatura);
router.delete("/:id", verificarToken, esAdmin, deleteAsignatura);

export default router;
