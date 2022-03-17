const express = require("express");
var bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/config", ".env") });
const route = require("./routes");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const expressSanitizer = require("express-sanitizer");
const logger = require("morgan");

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressSanitizer());

mongoose
  .connect(process.env.CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => console.log("mongodb running on 27017"))
  .catch((err) => console.log(err));

app.use("/api/v1", route);
app.use("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is working fine." });
});

// app.use(express.static(__dirname + "/public"));

//app.use(express.static(path.join(__dirname,'/public/images')));

app.use(function (req, res, next) {
  return res.status(404).json({
    success: false,
    message: "Page not found!",
  });
});
//require("./utils/cron");

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Express app running on port " + port);
});
