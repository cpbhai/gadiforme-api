const express = require("express");

const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");
const { signup, login, addvehicle } = require("../controllers/partner");

// User routes

router.post("/signup", signup);
router.post("/login", login);
router.post(
  "/add-vehicle",
  isAuthenticated,
  authorizeRoles("Partner"),
  addvehicle
);

module.exports = router;
