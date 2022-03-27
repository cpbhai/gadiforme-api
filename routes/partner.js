const express = require("express");

const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");
const { signup, login, addvehicle } = require("../controllers/partner");
const multer = require("multer");
const storage = multer.memoryStorage();
const { imagesPartnerSignup } = require("../utils/hardcoded");
// User routes

router.post("/signup", multer({ storage }).fields(imagesPartnerSignup), signup);
router.post("/login", login);
router.post(
  "/add-vehicle",
  isAuthenticated,
  authorizeRoles("Partner"),
  multer({ storage }).single("photo"),
  addvehicle
);

module.exports = router;
