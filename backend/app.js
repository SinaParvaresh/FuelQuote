'use strict';
const express = require("express");
const cors = require("cors");
const app = express();
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

module.exports = app;

// Hello everyone. These are the requirements for the project demo that you will be graded on:
// The app/website is running i.e. when the user enters the address e.g. localhost:3000 it displays a homepage (login/registration).
// Users are able to log in / sign up on the website.
// Users are able to edit their profiles and save them.
// Users can get a fuel quote.
// Users can access fuel quote history.
// All forms are properly validated.
// Check the DB for all the updates a user does.
// Contribution of each team member to the project, and showing it in the code.
// Code coverage and Unit tests.
// Good luck