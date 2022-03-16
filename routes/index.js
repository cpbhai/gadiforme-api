const express = require("express");
const router = express.Router();
//const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

// @Base Url
router.use((req, res, next) => {
  req["currentUrl"] = `${req.protocol + "://" + req.headers.host}`;
  next();
});

// @Client
const Client = require("./client");
router.use("/client", Client);

module.exports = router;
