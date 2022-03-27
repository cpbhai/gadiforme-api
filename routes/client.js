const express = require("express");

const router = express.Router();
//const { isAuthenticated } = require("../middlewares/auth");
const { signup, login, sendOtp } = require("../controllers/client");

// User routes

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOtp);

module.exports = router;
