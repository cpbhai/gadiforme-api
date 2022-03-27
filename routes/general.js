const express = require("express");

const router = express.Router();
//const { isAuthenticated } = require("../middlewares/auth");
const { showAvailableCars } = require("../controllers/general");

//routes
router.get("/available-cars", showAvailableCars);

module.exports = router;
