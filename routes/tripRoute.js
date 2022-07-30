const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

router.post("/new", tripController.new)
module.exports = router;
