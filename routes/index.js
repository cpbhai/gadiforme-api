const express = require("express");
const router = express.Router();
const tripRoute = require("../routes/tripRoute");
const partnerRoute = require("../routes/partnerRoute");

// @Base Url
router.use((req, _, next) => {
  req["currentUrl"] = `${req.protocol + "://" + req.headers.host}`;
  next();
});

router.use("/trip", tripRoute);
router.use("/partner", partnerRoute);

module.exports = router;
