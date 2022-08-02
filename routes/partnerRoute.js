const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partnerController");

router.post("/register", partnerController.register);
module.exports = router;
