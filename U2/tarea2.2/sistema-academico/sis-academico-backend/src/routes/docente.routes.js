import { Router } from "express";
import {
    getDocentes,
    getDocenteById,
    createDocente,
    updateDocente,
    deleteDocente
} from "../controllers/docente.controller.js";

import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verificarToken, getDocentes);
router.get("/:id", verificarToken, getDocenteById);
router.post("/", verificarToken, esAdmin, createDocente);
router.put("/:id", verificarToken, esAdmin, updateDocente);
router.delete("/:id", verificarToken, esAdmin, deleteDocente);

export default router;
