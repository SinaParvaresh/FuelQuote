'use strict';
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const userManagement = require("./routes/userManagement");
const profileManagement = require("./routes/profileManagement");
const fuelQuoteManagement = require("./routes/fuelQuoteManagement");
const { createSaltforToken } = require("./resources/tokenHandler");
const router = express.Router();
router.head('/', function (req, res) {
  res.status(200);
});

createSaltforToken();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/userManagement", userManagement.router);
app.use("/profileManagement", profileManagement.router);
app.use("/fuelQuoteManagement", fuelQuoteManagement.router);
app.use("/", router);

app.listen(port, () => {
  console.log(`Fuel Quote Server listening on port ${port}`);
});

module.exports = app;