const { Router } = require("express");
const UserController = require("../controllers/user.controller.js");
const oauthMiddleware = require("../middlewares/oauth.middleware.js");

const router = Router();

// Ruta protegida
router.get("/profile", oauthMiddleware, UserController.profile);

module.exports = router;
