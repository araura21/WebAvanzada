import { Router } from "express";
import { getUsers, createUser, deleteUser, reactivateUser } from "../controllers/user.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Todo protegido con token
router.get("/", verificarToken, getUsers);
router.post("/", verificarToken, createUser);
router.delete("/:id", verificarToken, deleteUser);
router.put("/:id/activate", verificarToken, reactivateUser);

export default router;
