const { json } = require("express");
var express = require("express");
var router = express.Router();
var fs = require("fs");

//use profiles.json file as hardcoded DB
const profileDB = JSON.parse(fs.readFileSync(`resources/profiles.json`));

/*grab profile from DB (if it exists)*/
router.post("/getProfile", function (req, res) {
  //desctructuring userId
  const { userId, ...rest } = req.body;
  if (profileDB[userId]==null) {
        res.status(404).json({
            status: "error",
            message: "User {"+userId+"} does not exist in Profile database."
        });
    }
    else {
        res.status(200).json({
            status: "success",
            data: {
                profile: profileDB[userId]
            }
        });
      }
});

/* update profile */
router.post("/updateProfile", function (req, res) {
  //desctructuring userId
  const { userId, ...rest } = req.body;

  if (profileDB[userId]==null)
    profileDB[userId]={};
  const updatedUserInfo = Object.assign(profileDB[userId], rest);

  res.status(201).json({
    status: "success",
    data: {
      profile: updatedUserInfo,
    },
  });

  //write POST request to JSON file
  fs.writeFile(`resources/profiles.json`, JSON.stringify(profileDB), (err) => {});
});

module.exports = router;
