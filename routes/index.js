const express = require("express");
const router = express.Router();
//const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

// @Base Url
router.use((req, res, next) => {
  req["currentUrl"] = `${req.protocol + "://" + req.headers.host}`;
  next();
});

// @Auth
const Auth = require("./auth");
router.use("/auth", Auth);

// @Client
const Client = require("./client");
router.use("/client", Client);

// @Partner
const Partner = require("./partner");
router.use("/partner", Partner);

// @General
const General = require("./general");
router.use("/general", General);

module.exports = router;
