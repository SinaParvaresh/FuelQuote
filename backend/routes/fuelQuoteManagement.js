const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const calculateRate = require("../resources/fuelQuoteCalculation");
const getQuoteFactors = require("../resources/fuelQuoteCalculation");

const GALLON_RATE = 1.5;

router.post("/getParamsForQuote", function (req, res) {
  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));

  /* Transfer these validations to separate validation functions later. */
  const { userId, ...rest } = req.body; //Destructuring userId
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
  /* Transfer this section to separate functions later.*/
  const userInfo = profileDB[userId];
  const secondAddress = (userInfo.address_2 == "" ? "" : ", " + userInfo.address_2);
  const restOfAddress = ", " + userInfo.city + ", " + userInfo.usa_state + ' ' + userInfo.zipcode;
  res.status(200).json({
    status: "success",
    data: {
      params: { address: (userInfo.address_1 + secondAddress + restOfAddress), gallon_rate: GALLON_RATE, quote_factors: getQuoteFactors() }
    }
  });
});

/*Grab fuel quotes for user from DB (if it exists)*/
router.post("/getQuotes", function (req, res) {
  //Use fuelQuotes.json file as hardcoded DB
  const fuelQuoteDB = JSON.parse(fs.readFileSync(`resources/fuelQuotes.json`));

  /* Transfer these validations to separate validation functions later. */
  const { userId, ...rest } = req.body; //Destructuring userId
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

/*Update quotes*/
router.post("/addQuote", function (req, res) {
  //Use fuelQuotes.json file as hardcoded DB
  const fuelQuoteDB = JSON.parse(fs.readFileSync(`resources/fuelQuotes.json`));

  /* Transfer these validations to separate validation functions later. */
  const { userId, deliveryAddress, ...rest } = req.body; //Destructuring userId and deliveryAddress
  if (fuelQuoteDB[userId] == null) {
    res.status(404).json({
      status: "error",
      message: "User {" + userId + "} does not exist in database.\nRecommend registering as new user."
    });
    return;
  }
  if (parseInt(rest.numOfGallons) != parseFloat(rest.numOfGallons)) {
    res.status(404).json({
      status: "error",
      message: "Gallons must be integer values."
    });
    return;
  }
  if (!(rest.numOfGallons > 0)) {
    res.status(404).json({
      status: "error",
      message: "Must order at least 1 gallon."
    });
    return;
  }

  /* Insert backend validations here and transfer to separate validation functions later. */

  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));
  const userInfo = profileDB[userId];
  const secondAddress = (userInfo.address_2 == "" ? "" : ", " + userInfo.address_2);
  const restOfAddress = ", " + userInfo.city + ", " + userInfo.usa_state + ' ' + userInfo.zipcode;
  if (deliveryAddress != (userInfo.address_1 + secondAddress + restOfAddress)) {
    res.status(404).json({
      status: "error",
      message: "Address of user {" + userId + "} does not match that in database."
    });
    return;
  }

  //Calculate quote rate
  const quoteNumber = fuelQuoteDB[userId].numberOfQuotes += 1;
  const perGallonPrice = calculateRate(rest.numOfGallons, userInfo.usa_state, quoteNumber - 1);

  fuelQuoteDB[userId]["q" + quoteNumber] = { deliveryAddress: deliveryAddress, ...rest }; /* All writes to database need to be validated. 'rest' needs to always be validated precisely first. */
  fuelQuoteDB[userId]["q" + quoteNumber]["totalCost"] = (parseInt(rest.numOfGallons) * perGallonPrice).toFixed(2);

  res.status(201).json({
    status: "success",
    data: {
      quotes: fuelQuoteDB[userId]["q" + quoteNumber],
    }
  });

  //Write POST request to JSON file
  fs.writeFile(`resources/fuelQuotes.json`, JSON.stringify(fuelQuoteDB), (err) => { });
});

module.exports = router;
