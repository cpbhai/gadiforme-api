const express = require("express");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "/configuration", ".env"),
});

const route = require("./routes");

const app = express();

const cors = require("cors");
const logger = require("morgan");

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(logger("dev"));
app.use(cors());

require("./configuration/database")();

app.use("/api/v1", route);
app.use("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is working fine." });
});

const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log("Express app running on port " + port);
});
