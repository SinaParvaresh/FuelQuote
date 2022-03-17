const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs");

/*Grab profile for user from DB (if it exists)*/
router.post("/getProfile", function (req, res) {
  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));

  /* Transfer these validations to separate validation functions later. */
  const { userId, ...rest } = req.body; //Destructuring userId
  const userProfile = profileDB[userId];
  if (userProfile == null) {
    res.status(404).json({
      status: "error",
      message: "User {" + userId + "} does not exist in database."
    });
    return;
  }
  if (userProfile.full_name == null) {
    res.status(404).json({
      status: "error-address",
      message: "User {" + userId + "} has not completed profile."
    });
    return;
  }
  const { password, ...toSend } = userProfile;
  res.status(200).json({
    status: "success",
    data: {
      profile: toSend
    }
  });
});

/*Update profile*/
router.post("/updateProfile", function (req, res) {
  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));

  /* Transfer these validations to separate validation functions later. */
  const { userId, ...rest } = req.body; //Destructuring userId
  if (profileDB[userId] == null) {
    res.status(404).json({
      status: "error",
      message: "User {" + userId + "} does not exist in database.\nRecommend registering as a new user."
    });
    return;
  }

  /* Insert backend validations here. */

  const { password, ...updatedUserInfo } = Object.assign(profileDB[userId], rest); /* All writes to database need to be validated. 'rest' needs to always be validated precisely first. */
  res.status(201).json({
    status: "success",
    data: {
      profile: updatedUserInfo,
    }
  });

  //Write POST request to JSON file
  fs.writeFile(`resources/users.json`, JSON.stringify(profileDB), (err) => { });
});

module.exports = router;
