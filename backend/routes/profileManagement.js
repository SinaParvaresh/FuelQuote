const { json } = require("express");
var express = require("express");
var router = express.Router();
var fs = require("fs");

//use user.json file as hardcoded DB
const profiles = JSON.parse(fs.readFileSync(`resources/users.json`));

/*grab profile from DB (if it exists)*/
router.get("/getProfile", function (req, res) {
  res.status(200).json({
    status: "success",
    users: profiles.length,
    data: {
      profiles: profiles,
    },
  });
});

/* update profile */
router.post("/updateProfile", function (req, res) {
  //desctructuring userId
  const { userId, ...rest } = req.body;
  const updatedUserInfo = Object.assign(profiles[userId], rest);

  res.status(201).json({
    status: "success",
    data: {
      profiles: updatedUserInfo,
    },
  });

  //write POST request to JSON file
  fs.writeFile(`resources/users.json`, JSON.stringify(profiles), (err) => {});
});

module.exports = router;
