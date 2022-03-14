const { json } = require("express");
var express = require("express");
var router = express.Router();
var fs = require("fs");

//use user.json file as hardcoded DB
const profiles = JSON.parse(fs.readFileSync(`resources/users.json`));
const userName = profiles["username"];

/*grab credentials from DB (if it exists)*/

router.get("/getCredentials", function (req, res) {
    res.status(200).json({
        status: "success",
        users: profiles.length,
        data: {
            profiles: profiles
        },
    });
});


router.post("/authentication", function (req, res) {
    console.log(profiles)
    const { username, password } = req.body;
    if (username != "elias@gmail.com" || password != "goodbye") {
        res.status(404).json({
            status: "error",
            message: "Invalid Credentials"
        });
    } else {
        res.status(200).json({
            status: "success",
            data: {
                username: username,
                password: password
            }
        });
    }
});


module.exports = router;
