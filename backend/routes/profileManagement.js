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
    results: profiles.length,
    data: {
      profiles,
    },
  });
});


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  })
  return newObj;
}

/* update profile */
router.post("/updateProfile", function (req, res) {
  
  fs.writeFile(`resources/users.json`, JSON.stringify(profiles), (err) => {
    res.status(201).json({
      status: "success",
      data: {
        profiles: profiles[1],
      },
    });
  });
});

module.exports = router;
