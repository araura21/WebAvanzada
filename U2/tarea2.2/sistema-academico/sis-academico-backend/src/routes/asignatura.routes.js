import { Router } from "express";
import { getAsignaturas, createAsignatura } from "../controllers/asignatura.controller.js";

const router = Router();

router.get("/", getAsignaturas);
router.post("/", createAsignatura);

export default router;
