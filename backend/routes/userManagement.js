const router = require("express").Router();
const fs = require("fs");
const { createToken, validateToken, deleteToken } = require("../resources/tokenHandler");

router.post("/authentication", function (req, res) {
    //Use users.json file as hardcoded DB
    const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
    const { username, password } = req.body;
    if (!userDB[username] || (password != userDB[username].password)) {
        console.error("Username {" + username + "} and Password {" + password + "} are incorrect.");
        res.status(403).json({
            status: "error-credentials",
            message: "Invalid Credentials"
        });
        return;
    }
    const userToken = createToken(username);
    res.status(201).json({
        status: "success",
        data: {
            token: userToken
        }
    });
});

router.post("/logout", function (req, res) {
    const { token } = req.body; //Destructuring token
    const userId = validateToken(token, res);
    if (userId === undefined)
        return;
    deleteToken(token);
    res.status(200).json({
        status: "success"
    });
});

router.post("/addUser", function (req, res) {
    //Use users.json file as hardcoded DB
    const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
    const fuelQuoteDB = JSON.parse(fs.readFileSync(`resources/fuelQuotes.json`));
    /* Transfer these validations to separate validation functions later. */
    const { username, password } = req.body; //Destructuring username and password
    if (userDB[username] != null) {
        console.error("User {" + username + "} already exists. Cannot register again.");
        res.status(403).json({
            status: "error-duplicate",
            message: "User {" + username + "} already exists in User database."
        });
        return;
    }
    if (!username.trim().match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        console.error("Username {" + username + "} is not of email format.");
        res.status(403).json({
            status: "error-email",
            message: "Username must be in valid email format."
        });
        return;
    }
    if (!password.match(/^\S+$/)) {
        console.error("Password {" + password + "} should not contain whitespaces.");
        res.status(403).json({
            status: "error-password",
            message: "Password cannot contain whitespaces."
        });
        return;
    }
    userDB[username] = { "password": password };
    fuelQuoteDB[username] = { "numberOfQuotes": 0 };
    res.status(201).json({
        status: "success",
        data: {
            username: username
        }
    });
    //Update JSON files
    fs.writeFileSync(`resources/users.json`, JSON.stringify(userDB));
    fs.writeFileSync(`resources/fuelQuotes.json`, JSON.stringify(fuelQuoteDB));
});

const deleteUser = (username) => {
    //Use users.json and fuelQuotes.json files as hardcoded DBs
    const userDB = JSON.parse(fs.readFileSync(`resources/users.json`));
    const fuelQuoteDB = JSON.parse(fs.readFileSync(`resources/fuelQuotes.json`));
    if (userDB[username] != null)
        delete userDB[username];
    if (fuelQuoteDB[username] != null)
        delete fuelQuoteDB[username];
    //Update JSON files
    fs.writeFileSync(`resources/users.json`, JSON.stringify(userDB));
    fs.writeFileSync(`resources/fuelQuotes.json`, JSON.stringify(fuelQuoteDB));
};

module.exports = router;