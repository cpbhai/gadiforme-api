const express = require("express");

const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { loadUser } = require("../controllers/auth");

// User routes

router.get("/load-user", isAuthenticated, loadUser);

module.exports = router;
