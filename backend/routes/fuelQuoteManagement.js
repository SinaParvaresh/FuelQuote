const router = require("express").Router();
const fs = require("fs");
const { calculateRate } = require("../resources/fuelQuoteCalculation");
const { getQuoteFactors } = require("../resources/fuelQuoteCalculation");
const { validateToken } = require("../resources/tokenHandler");

const getParamsForQuote = (req, res) => {
  const { token } = req.headers; //Destructuring token
  const [userId, expiration] = validateToken(token, res);
  if (userId === undefined)
    return;
  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync('resources/users.json'));
  if (!profileDB[userId].address_1) {
    console.error(`User {${userId}} is missing Address 1.`);
    res.status(403).json({
      status: "error-profile",
      message: `User {${userId}} has not completed profile.`,
      expiration: expiration
    });
    return;
  }
  const userInfo = profileDB[userId];
  const secondAddress = (userInfo.address_2 == "" ? "" : ", " + userInfo.address_2);
  const restOfAddress = ", " + userInfo.city + ", " + userInfo.usa_state + ' ' + userInfo.zipcode;
  //Use fuelQuotes.json file as hardcoded DB
  const fuelQuoteDB = JSON.parse(fs.readFileSync('resources/fuelQuotes.json'));
  res.status(200).json({
    status: "success",
    data: {
      params: { address: (userInfo.address_1 + secondAddress + restOfAddress), quote_factors: getQuoteFactors(userInfo.usa_state, fuelQuoteDB[userId].numberOfQuotes) }
    },
    expiration: expiration
  });
};
router.get("/getParamsForQuote", getParamsForQuote);

/*Update quotes*/
const addQuote = (req, res) => {
  const { token } = req.headers; //Destructuring token
  const [userId, expiration] = validateToken(token, res);
  if (userId === undefined)
    return;
  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync('resources/users.json'));
  if (!profileDB[userId].address_1) {
    console.error(`User {${userId}} is missing Address 1.`);
    res.status(403).json({
      status: "error-profile",
      message: `User {${userId}} has not completed profile.`,
      expiration: expiration
    });
    return;
  }
  //Extract all needed fields from request body.
  const cleaned_rest = {}
  const profileFields = ['deliveryAddress', 'numOfGallons', 'deliveryDate']
  profileFields.forEach(field => cleaned_rest[field] = req.body[field]);
  if (!profileFields.every(field => (typeof cleaned_rest[field] === "string") && (cleaned_rest[field] != ""))) {
    console.error("One of the given fields is missing or not of string type.");
    res.status(400).json({
      status: "error-field_type",
      message: "Fields ['deliveryAddress', 'numOfGallons', 'deliveryDate'] are required and must be of string type.",
      expiration: expiration
    });
    return;
  }
  //Individual field validations
  if (parseInt(cleaned_rest.numOfGallons) != parseFloat(cleaned_rest.numOfGallons)) {
    console.error(`Gallons {${cleaned_rest.numOfGallons}} are of incorrect type.`);
    res.status(403).json({
      status: "error-gallons",
      message: "Gallons must be whole integer values.",
      expiration: expiration
    });
    return;
  }
  if ((cleaned_rest.numOfGallons < 1) || (cleaned_rest.numOfGallons > (10 ** 6))) {
    console.error(`Gallons {${cleaned_rest.numOfGallons}} are less than 1 or greater 1,000,000.`);
    res.status(403).json({
      status: "error-gallons",
      message: "Must order whole gallons between 1 and 1,000,000.",
      expiration: expiration
    });
    return;
  }
  const today = new Date(new Date().toDateString());
  if ((new Date(cleaned_rest.deliveryDate)) < today) {
    console.error(`Requested delivery date {${new Date(cleaned_rest.deliveryDate).toLocaleDateString()}}`
      + ` is before today {${new Date(today).toLocaleDateString()}}.`);
    res.status(403).json({
      status: "error-delivery_date",
      message: "Delivery date must be after today's date. Same day quotes are not permitted.",
      expiration: expiration
    });
    return;
  }
  const userInfo = profileDB[userId];
  const secondAddress = (userInfo.address_2 == "" ? "" : (", " + userInfo.address_2));
  const restOfAddress = `, ${userInfo.city}, ${userInfo.usa_state} ${userInfo.zipcode}`;
  if (cleaned_rest.deliveryAddress !== (userInfo.address_1 + secondAddress + restOfAddress)) {
    console.error(`{${cleaned_rest.deliveryAddress}} != {${(userInfo.address_1 + secondAddress + restOfAddress)}}`);
    res.status(403).json({
      status: "error-address",
      message: `Address of user {${userId}} does not match that in database.`,
      expiration: expiration
    });
    return;
  }
  //Use fuelQuotes.json file as hardcoded DB
  const fuelQuoteDB = JSON.parse(fs.readFileSync('resources/fuelQuotes.json'));
  //Calculate quote rate
  const quoteNumber = fuelQuoteDB[userId].numberOfQuotes += 1;
  const perGallonPrice = calculateRate(cleaned_rest.numOfGallons, userInfo.usa_state, quoteNumber - 1);
  if (req.body.gallonRate !== perGallonPrice.toString())
    console.warn(`Frontend price rate {${req.body.gallonRate}} does not match backend price rate {${perGallonPrice}}.`);
  //Store fuel quote request in database
  fuelQuoteDB[userId]["q" + quoteNumber] = { ...cleaned_rest };
  fuelQuoteDB[userId]["q" + quoteNumber]["gallonRate"] = perGallonPrice.toString();
  fuelQuoteDB[userId]["q" + quoteNumber]["totalCost"] = (parseInt(cleaned_rest.numOfGallons) * perGallonPrice).toFixed(2);
  res.status(201).json({
    status: "success",
    data: {
      quotes: fuelQuoteDB[userId]["q" + quoteNumber]
    },
    expiration: expiration
  });
  //Update JSON file
  fs.writeFileSync('resources/fuelQuotes.json', JSON.stringify(fuelQuoteDB));
};
router.post("/addQuote", addQuote);

/*Grab fuel quotes for user from DB (if it exists)*/
const getQuotes = (req, res) => {
  const { token } = req.headers; //Destructuring token
  const [userId, expiration] = validateToken(token, res);
  if (userId === undefined)
    return;
  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync('resources/users.json'));
  if (!profileDB[userId].address_1) {
    console.error(`User {${userId}} is missing Address 1.`);
    res.status(403).json({
      status: "error-profile",
      message: `User {${userId}} has not completed profile.`,
      expiration: expiration
    });
    return;
  }
  //Use fuelQuotes.json file as hardcoded DB
  const fuelQuoteDB = JSON.parse(fs.readFileSync('resources/fuelQuotes.json'));
  res.status(200).json({
    status: "success",
    data: {
      quotes: fuelQuoteDB[userId]
    },
    expiration: expiration
  });
};
router.get("/getQuotes", getQuotes);

module.exports = { router, getParamsForQuote, getQuotes, addQuote };