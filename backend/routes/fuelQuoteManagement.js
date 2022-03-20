const router = require("express").Router();
const fs = require("fs");
const { calculateRate } = require("../resources/fuelQuoteCalculation");
const { getQuoteFactors } = require("../resources/fuelQuoteCalculation");
const { validateToken } = require("../resources/tokenHandler");

router.post("/getParamsForQuote", function (req, res) {
  const { token, ...rest } = req.body; //Destructuring token
  const userId = validateToken(token, res);
  if (userId === undefined)
    return;
  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));
  /* Transfer these validations to separate validation functions later. */
  if (!profileDB[userId].address_1) {
    console.error("User {" + userId + "} is missing Address 1.");
    res.status(403).json({
      status: "error-address",
      message: "User {" + userId + "} has not completed profile before fuel quote."
    });
    return;
  }
  /* Transfer this section to separate functions later.*/
  const userInfo = profileDB[userId];
  const secondAddress = (userInfo.address_2 == "" ? "" : ", " + userInfo.address_2);
  const restOfAddress = ", " + userInfo.city + ", " + userInfo.usa_state + ' ' + userInfo.zipcode;
  res.status(201).json({
    status: "success",
    data: {
      params: { address: (userInfo.address_1 + secondAddress + restOfAddress), quote_factors: getQuoteFactors() }
    }
  });
});

/*Grab fuel quotes for user from DB (if it exists)*/
router.post("/getQuotes", function (req, res) {
  const { token, ...rest } = req.body; //Destructuring token
  const userId = validateToken(token, res);
  if (userId === undefined)
    return;
  //Use fuelQuotes.json file as hardcoded DB
  const fuelQuoteDB = JSON.parse(fs.readFileSync(`resources/fuelQuotes.json`));
  res.status(201).json({
    status: "success",
    data: {
      quotes: fuelQuoteDB[userId]
    }
  });
});

/*Update quotes*/
router.post("/addQuote", function (req, res) {
  const { token, deliveryAddress, ...rest } = req.body; //Destructuring token and deliveryAddress
  const userId = validateToken(token, res);
  if (userId === undefined)
    return;
  /* Transfer these validations to separate validation functions later. */
  if (parseInt(rest.numOfGallons) != parseFloat(rest.numOfGallons)) {
    console.error("Gallons {" + rest.numOfGallons + "} are of incorrect type.");
    res.status(403).json({
      status: "error-gallons_type",
      message: "Gallons must be integer values."
    });
    return;
  }
  if (!(rest.numOfGallons > 0)) {
    console.error("Gallons {" + rest.numOfGallons + "} are less than 1.");
    res.status(403).json({
      status: "error-number_of_gallons",
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
    console.error('{' + deliveryAddress + '} ' + '!=' + ' {' + (userInfo.address_1 + secondAddress + restOfAddress) + '}');
    res.status(403).json({
      status: "error-address",
      message: "Address of user {" + userId + "} does not match that in database."
    });
    return;
  }
  //Use fuelQuotes.json file as hardcoded DB
  const fuelQuoteDB = JSON.parse(fs.readFileSync(`resources/fuelQuotes.json`));
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
  //Update JSON file
  fs.writeFileSync(`resources/fuelQuotes.json`, JSON.stringify(fuelQuoteDB));
});

module.exports = router;