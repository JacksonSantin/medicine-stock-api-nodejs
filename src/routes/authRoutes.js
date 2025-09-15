const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// inicia OAuth
router.get("/google", authController.googleLogin);

// callback
router.get("/google/callback", authController.googleCallback);

module.exports = router;
