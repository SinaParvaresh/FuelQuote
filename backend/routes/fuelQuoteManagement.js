const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const fuelQuoteCalculation = require("../resources/fuelQuoteCalculation");

const GALLON_RATE = 1.5;

router.post("/getParamsForQuote", function (req, res) {
  //use fuelQuotes.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));
  //desctructuring userId
  const { userId, ...rest } = req.body;
  if (profileDB[userId] == null) {
    res.status(404).json({
      status: "error",
      message: "User {" + userId + "} does not exist in database."
    });
    return;
  }
  if (profileDB[userId].address_1 == null) {
    res.status(404).json({
      status: "error-address",
      message: "User {" + userId + "} has not completed profile before fuel quote."
    });
    return;
  }
  const userInfo = profileDB[userId];
  const secondAddress = (userInfo.address_2 == "" ? "" : ", " + userInfo.address_2);
  res.status(200).json({
    status: "success",
    data: {
      params: { "address": (userInfo.address_1 + secondAddress), "gallon_rate": GALLON_RATE }
    }
  });
});

/*grab fuel quotes for user from DB (if it exists)*/
router.post("/getQuotes", function (req, res) {
  //use fuelQuotes.json file as hardcoded DB
  const fuelQuoteDB = JSON.parse(fs.readFileSync(`resources/fuelQuotes.json`));
  //desctructuring userId
  const { userId, ...rest } = req.body;
  if (fuelQuoteDB[userId] == null) {
    res.status(404).json({
      status: "error",
      message: "User {" + userId + "} does not exist in database."
    });
    return;
  }
  res.status(200).json({
    status: "success",
    data: {
      quotes: fuelQuoteDB[userId]
    }
  });
});

/* update quotes */
router.post("/addQuote", function (req, res) {
  //use fuelQuotes.json file as hardcoded DB
  const fuelQuoteDB = JSON.parse(fs.readFileSync(`resources/fuelQuotes.json`));
  //desctructuring userId
  const { userId, ...rest } = req.body;

  if (fuelQuoteDB[userId] == null) {
    res.status(404).json({
      status: "error",
      message: "User {" + userId + "} does not exist in database.\nRecommend registering as new user."
    });
    return;
  }

  const quoteNumber = fuelQuoteDB[userId].numberOfQuotes = parseInt(fuelQuoteDB[userId].numberOfQuotes) + 1;

  fuelQuoteDB[userId]["q" + quoteNumber] = { ...rest };
  fuelQuoteDB[userId]["q" + quoteNumber]["totalCost"] = (parseInt(rest.numOfgallons) * GALLON_RATE).toFixed(2);

  res.status(201).json({
    status: "success",
    data: {
      quotes: fuelQuoteDB[userId]["q" + quoteNumber],
    },
  });

  //write POST request to JSON file
  fs.writeFile(`resources/fuelQuotes.json`, JSON.stringify(fuelQuoteDB), (err) => { });
});

module.exports = router;
