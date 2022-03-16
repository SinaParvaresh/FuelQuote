const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs");

// //use users.json file as hardcoded DB
// const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));

/*grab profile for user from DB (if it exists)*/
router.post("/getProfile", function (req, res) {
  //use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));
  //desctructuring userId
  const { userId, ...rest } = req.body;
  const userProfile=profileDB[userId];
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
  const {password, ...toSend}=userProfile;
  res.status(200).json({
    status: "success",
    data: {
      profile: toSend
    }
  });
});

/* update profile */
router.post("/updateProfile", function (req, res) {
  //use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));
  //desctructuring userId
  const { userId, ...rest } = req.body;

  if (profileDB[userId] == null) {
    res.status(404).json({
      status: "error",
      message: "User {" + userId + "} does not exist in database.\nRecommend registering as a new user."
    });
    return;
  }

  const { password, ...updatedUserInfo } = Object.assign(profileDB[userId], rest);
  res.status(201).json({
    status: "success",
    data: {
      profile: updatedUserInfo,
    },
  });

  //write POST request to JSON file
  fs.writeFile(`resources/users.json`, JSON.stringify(profileDB), (err) => { });
});

module.exports = router;
