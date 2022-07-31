const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

router.post("/new", tripController.new);
router.get("/:_id", tripController.trip);
module.exports = router;
