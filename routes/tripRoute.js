const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const auth = require("../middlewares/auth");

router.post(
  "/add",
  auth.isAuthenticated,
  auth.authorizeRoles("Client"),
  tripController.add
);

router.get("/list", auth.isAuthenticated, tripController.list);
module.exports = router;
