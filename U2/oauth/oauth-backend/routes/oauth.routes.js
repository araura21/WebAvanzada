const { Router } = require("express");
const oauthController = require("../controllers/oauth.controller.js");

const router = Router();

router.post("/login", oauthController.login);

module.exports = router;
