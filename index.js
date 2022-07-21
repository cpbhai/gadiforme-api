const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");
require("dotenv").config({
  path: path.join(__dirname, "/configuration", ".env"),
});

const route = require("./routes");

const app = express();

const cors = require("cors");
const logger = require("morgan");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(fileUpload());

require("./configuration/database")();

app.use(logger("dev"));
app.use("/v1", route);
app.use("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is working fine." });
});

app.use(function (_, res) {
  res
    .status(500)
    .json({ success: false, message: "No such matching route was found" });
});

const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log("Express app running on port " + port);
});
