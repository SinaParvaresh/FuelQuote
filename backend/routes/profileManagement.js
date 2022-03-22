const router = require("express").Router();
const fs = require("fs");
const { validateToken } = require("../resources/tokenHandler");

const LIST_OF_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI',
  'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT',
  'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD',
  'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

/*Grab profile for user from DB (if it exists)*/
router.post("/getProfile", function (req, res) {
  const { token } = req.body; //Destructuring token
  const [userId, expiration] = validateToken(token, res);
  if (userId === undefined)
    return;
  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync('resources/users.json'));
  if (!profileDB[userId].full_name) {
    console.error(`User {${userId}} is missing full name,\n   and therefore must have not completed profile.`);
    res.status(403).json({
      status: "error-profile",
      message: `User {${userId}} has not completed profile.`,
      expiration: expiration
    });
    return;
  }
  const { password, ...toSend } = profileDB[userId];
  res.status(201).json({
    status: "success",
    data: {
      profile: toSend
    },
    expiration: expiration
  });
});

/*Update profile*/
router.post("/updateProfile", function (req, res) {
  const { token, ...rest } = req.body; //Destructuring token
  const [userId, expiration] = validateToken(token, res);
  if (userId === undefined)
    return;
  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync('resources/users.json'));
  //Extract all needed fields from request body.
  const cleaned_rest = {}
  const profileFields = ['full_name', 'address_1', 'address_2', 'city', 'usa_state', 'zipcode']
  profileFields.forEach(field => cleaned_rest[field] = rest[field]);
  if (!profileFields.reduce((prev, field) => prev * (typeof cleaned_rest[field] === "string"), 1)) {
    console.error("One of the given fields is missing or not of string type.");
    res.status(400).json({
      status: "error-field_type",
      message: "Fields ['full_name', 'address_1', 'address_2', 'city', 'usa_state', 'zipcode']" +
        " are required and must be of string type.\nBut address_2 may be left as an empty string.",
      expiration: expiration
    });
    return;
  }
  if (profileFields.reduce((prev, field) => prev * (profileDB[userId][field] === cleaned_rest[field]), 1)) {
    console.warn("New profile update request matches old profile.");
    res.status(200).json({
      status: "success",
      message: "New profile matches old profile. Therefore, no update was made.",
      expiration: expiration
    });
    return;
  }
  //Individual field validations
  if ((cleaned_rest.full_name.length > 50) || (!cleaned_rest.full_name.match(/^(?:[a-zA-Z]+(?:[\-][a-zA-Z]+)*)+(\s(?:[a-zA-Z]+(?:[\-][a-zA-Z]+)*)+)+$/))) {
    console.error("Full name field is of incorrect format or exceeds 50 characters.");
    res.status(400).json({
      status: "error-full_name",
      message: "Full name field is not of correct format or exceeds 50 characters.",
      expiration: expiration
    });
    return;
  }
  if ((cleaned_rest.address_1.length > 100) || (!cleaned_rest.address_1.match(/^\s*\S+(?:\s\S+)*\s*$/))) {
    console.error("Address 1 field is of incorrect format or exceeds 100 characters.");
    res.status(400).json({
      status: "error-address_1",
      message: "Address 1 field is not of correct format or exceeds 100 characters.",
      expiration: expiration
    });
    return;
  }
  if ((cleaned_rest.address_2 != "") && ((cleaned_rest.address_2.length > 100) || (!cleaned_rest.address_2.match(/^\s*\S+(?:\s\S+)*\s*$/)))) {
    console.error("Address 2 field is of incorrect format or exceeds 100 characters.");
    res.status(400).json({
      status: "error-address_2",
      message: "Address 2 field is not of correct format or exceeds 100 characters.",
      expiration: expiration
    });
    return;
  }
  if ((cleaned_rest.city.length > 100) || (!cleaned_rest.city.match(/^\s*(?:[a-zA-Z]+(?:[-][a-zA-Z]+)*)+(\s(?:[a-zA-Z]+(?:[-][a-zA-Z]+)*)+)*\s*$/))) {
    console.error("City field is of incorrect format or exceeds 100 characters.");
    res.status(400).json({
      status: "error-city",
      message: "City field is not of correct format or exceeds 100 characters.",
      expiration: expiration
    });
    return;
  }
  if (!LIST_OF_STATES.includes(cleaned_rest.usa_state)) {
    console.error(`State {${cleaned_rest.usa_state}} does not match any of the 50 states 2-character codes.`);
    res.status(400).json({
      status: "error-state",
      message: "State field does not match any of the 2-character codes for the 50 USA states.",
      expiration: expiration
    });
    return;
  }
  if (!cleaned_rest.zipcode.match(/^[0-9]{5,9}$/)) {
    console.error("Zipcode field is of incorrect format or not between 5 and 9 digits.");
    res.status(400).json({
      status: "error-zipcode",
      message: "Zipcode field is not of correct format or not between 5 and 9 digits.",
      expiration: expiration
    });
    return;
  }
  //Store profile info in database
  const { password, ...updatedUserInfo } = Object.assign(profileDB[userId], cleaned_rest);
  res.status(201).json({
    status: "success",
    data: {
      profile: updatedUserInfo,
    },
    expiration: expiration
  });
  //Update JSON file
  fs.writeFileSync('resources/users.json', JSON.stringify(profileDB));
});

module.exports = router;