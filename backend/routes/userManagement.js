const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs");

// //use users.json file as hardcoded DB
// const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
// const userName = userDB["username"];

/*
grab credentials from DB (if it exists)
--- REMOVE THIS FUNCTION LATER ---
*/ 
router.get("/getCredentials", function (req, res) {
    //use users.json file as hardcoded DB
    const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
    res.status(200).json({
        status: "success",
        users: userDB.length,
        data: {
            users: userDB
        },
    });
});

router.post("/authentication", function (req, res) {
    //use users.json file as hardcoded DB
    const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
    // console.log(userDB)
    const { username, password } = req.body;
    
    if (userDB[username]==null || (password != userDB[username].password))
    // if (username != "elias@gmail.com" || password != "goodbye")
    {
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
    //use users.json file as hardcoded DB
    const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
    const fuelQuoteDB = JSON.parse(fs.readFileSync(`resources/fuelQuotes.json`));
    //desctructuring userId
    const { username, password } = req.body;

    if (userDB[username]!=null)
    {
        res.status(404).json({
            status: "error",
            message: "User {"+username+"} already exists in User database."
        });
        return;
    }

    userDB[username]={"password" : password};
    fuelQuoteDB[username]={"numberOfQuotes" : 0};

    res.status(201).json({
      status: "success",
      data: {
        user: {username:{"password":password}},
      },
    });
  
    //write POST request to JSON file
    fs.writeFile(`resources/users.json`, JSON.stringify(userDB), (err) => {});
    fs.writeFile(`resources/fuelQuotes.json`, JSON.stringify(fuelQuoteDB), (err) => {});
  });

module.exports = router;
