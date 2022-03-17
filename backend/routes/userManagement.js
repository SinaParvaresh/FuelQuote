const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs");

/*Grab credentials from DB (if it exists)
--- REMOVE THIS FUNCTION LATER --- */
router.get("/getCredentials", function (req, res) {
    //Use users.json file as hardcoded DB
    const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
    res.status(200).json({
        status: "success",
        users: userDB.length,
        data: {
            users: userDB
        }
    });
});

router.post("/authentication", function (req, res) {
    //Use users.json file as hardcoded DB
    const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
    const { username, password } = req.body;

    if (userDB[username] == null || (password != userDB[username].password)) {
        res.status(404).json({
            status: "error",
            message: "Invalid Credentials"
        });
    }
    else {
        res.status(200).json({
            status: "success",
            data: {
                username: username,
                password: password
            }
        });
    }
});

router.post("/addUser", function (req, res) {
    //Use users.json file as hardcoded DB
    const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
    const fuelQuoteDB = JSON.parse(fs.readFileSync(`resources/fuelQuotes.json`));

    /* Transfer these validations to separate validation functions later. */
    const { username, password } = req.body; //Destructuring username and password
    if (userDB[username] != null) {
        res.status(404).json({
            status: "error",
            message: "User {" + username + "} already exists in User database."
        });
        return;
    }
    if (!username.trim().match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        res.status(404).json({
            status: "error",
            message: "Username must be in valid email format."
        });
        return;
    }
    if (!password.match(/^\S+$/)) {
        res.status(404).json({
            status: "error",
            message: "Password cannot contain whitespaces."
        });
        return;
    }

    userDB[username] = { "password": password };
    fuelQuoteDB[username] = { "numberOfQuotes": 0 };

    res.status(201).json({
        status: "success",
        data: {
            username: username,
            password: password
        }
    });

    //Write POST request to JSON file
    fs.writeFile(`resources/users.json`, JSON.stringify(userDB), (err) => { });
    fs.writeFile(`resources/fuelQuotes.json`, JSON.stringify(fuelQuoteDB), (err) => { });
});

module.exports = router;
