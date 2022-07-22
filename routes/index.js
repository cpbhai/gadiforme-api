const express = require("express");
const router = express.Router();
const userRoute = require("../routes/userRoute");
const partnerRoute = require("../routes/partnerRoute");
const tripRoute = require("../routes/tripRoute");

// @Base Url
router.use((req, _, next) => {
  req["currentUrl"] = `${req.protocol + "://" + req.headers.host}`;
  next();
});

router.use("/user", userRoute);
router.use("/partner", partnerRoute);
router.use("/trip", tripRoute);

module.exports = router;
