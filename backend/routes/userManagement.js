const { json } = require("express");
var express = require("express");
var router = express.Router();
var fs = require("fs");

//use users.json file as hardcoded DB
const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
// const userName = userDB["username"];

/*grab credentials from DB (if it exists)*/

router.get("/getCredentials", function (req, res) {
    res.status(200).json({
        status: "success",
        users: userDB.length,
        data: {
            users: userDB
        },
    });
});


router.post("/authentication", function (req, res) {
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
    res.status(201).json({
      status: "success",
      data: {
        user: {username:{"password":password}},
      },
    });
  
    //write POST request to JSON file
    fs.writeFile(`resources/users.json`, JSON.stringify(userDB), (err) => {});
  });

module.exports = router;
