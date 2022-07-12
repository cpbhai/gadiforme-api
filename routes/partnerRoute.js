const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partnerController");
const auth = require("../middlewares/auth");

router.post(
  "/add-info",
  auth.isAuthenticated,
  auth.authorizeRoles("Partner"),
  partnerController.addInfo
);
module.exports = router;
