const router = require("express").Router();
const fs = require("fs");
const { validateToken } = require("../resources/tokenHandler");

/*Grab profile for user from DB (if it exists)*/
router.post("/getProfile", function (req, res) {
  const { token, ...rest } = req.body; //Destructuring token
  const userId = validateToken(token, res);
  if (userId === undefined)
    return;

  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));

  /* Transfer these validations to separate validation functions later. */
  const userProfile = profileDB[userId];
  if (!userProfile.full_name) {
    console.error("User {" + userId + "} is missing full name,\n   and therefore must have not completed profile.");
    res.status(403).json({
      status: "error-profile",
      message: "User {" + userId + "} has not completed profile."
    });
    return;
  }
  const { password, ...toSend } = userProfile;
  res.status(201).json({
    status: "success",
    data: {
      profile: toSend
    }
  });
});

/*Update profile*/
router.post("/updateProfile", function (req, res) {
  const { token, ...rest } = req.body; //Destructuring token
  const userId = validateToken(token, res);
  if (userId === undefined)
    return;

  //Use users.json file as hardcoded DB
  const profileDB = JSON.parse(fs.readFileSync(`resources/users.json`));

  /* Transfer these validations to separate validation functions later. */
  /* Insert backend validations here. */

  const { password, ...updatedUserInfo } = Object.assign(profileDB[userId], rest); /* All writes to database need to be validated. 'rest' needs to always be validated precisely first. */
  res.status(201).json({
    status: "success",
    data: {
      profile: updatedUserInfo,
    }
  });

  //Update JSON file
  fs.writeFileSync(`resources/users.json`, JSON.stringify(profileDB));
});

module.exports = router;
