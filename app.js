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
require("cloudinary").config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use("/api/v1", route);
app.use("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is working fine." });
});

/*Frontend hai*/
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Express app running on port " + port);
});
