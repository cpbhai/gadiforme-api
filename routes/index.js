const express = require("express");
const router = express.Router();
const { userRoute } = require("../routes/userRoute");

// @Base Url
router.use((req, res, next) => {
  req["currentUrl"] = `${req.protocol + "://" + req.headers.host}`;
  next();
});

router.use("/user", userRoute);

module.exports = router;
