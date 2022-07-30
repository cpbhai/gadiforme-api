const express = require("express");
const router = express.Router();
const tripRoute = require("../routes/tripRoute");

// @Base Url
router.use((req, _, next) => {
  req["currentUrl"] = `${req.protocol + "://" + req.headers.host}`;
  next();
});

router.use("/trip", tripRoute);

module.exports = router;
