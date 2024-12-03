const express = require("express");
const AccessController = require("../../controllers/access");
const router = express.Router();

// signUp
router.post("/shop/signup", AccessController.signUp);

module.exports = router;
