const router = require("express").Router();
const fs = require("fs");
const { createToken, validateToken, deleteToken } = require("../resources/tokenHandler");

const authentication = (req, res) => {
    const { username, password } = req.body;
    if (((username && password) == false) || (typeof username != "string") || (typeof password != "string")) {
        console.error("Username or password is empty or not strings.");
        res.status(400).json({
            status: "error-empty",
            message: "Username or password fields are empty or not of string type."
        });
        return;
    }
    //Use users.json file as hardcoded DB
    const userDB = JSON.parse(fs.readFileSync('resources/users.json'));
    if (!userDB[username] || (password != userDB[username].password)) {
        console.error(`Username {${username}} and Password {${password}} are incorrect.`);
        res.status(403).json({
            status: "error-credentials",
            message: "Invalid Credentials."
        });
        return;
    }
    const userToken = createToken(username);
    res.status(200).json({
        status: "success",
        data: {
            token: userToken[0],
            expiration: userToken[1]
        }
    });
};
router.post("/authentication", authentication);

const logout = (req, res) => {
    const { token } = req.headers; //Destructuring token
    const [userId] = validateToken(token, res);
    if (userId === undefined)
        return;
    deleteToken(token);
    res.status(200).json({
        status: "success"
    });
}
router.get("/logout", logout);

const addUser = (req, res) => {
    const { username, password } = req.body; //Destructuring username and password
    if (((username && password) == false) || (typeof username != "string") || (typeof password != "string")) {
        console.error("Username or password is empty or not strings.");
        res.status(400).json({
            status: "error-empty",
            message: "Username or password fields are empty or not of string type."
        });
        return;
    }
    //Use users.json file as hardcoded DB
    const userDB = JSON.parse(fs.readFileSync('resources/users.json'));
    if (!!userDB[username]) {
        console.error(`User {${username}} already exists. Cannot register again.`);
        res.status(403).json({
            status: "error-duplicate",
            message: `User {${username}} already exists in user database.`
        });
        return;
    }
    if (!username.match(/^\w+(?:[.-]?\w+)*@\w+(?:[.-]?\w+)*(?:\.\w{2,3})+$/)) {
        console.error(`Username {${username}} is not of email format.`);
        res.status(400).json({
            status: "error-email",
            message: "Username is not in valid email format."
        });
        return;
    }
    if ((password.length < 8) || (password.length > 16)) {
        console.error(`Password {${password}} is of incorrect length {${password.length}} when should be between 8 and 16 characters.`);
        res.status(400).json({
            status: "error-password",
            message: "Password is not between 8 and 16 characters."
        });
        return;
    }
    if (!password.match(/^\S+$/)) {
        console.error(`Password {${password}} should not contain whitespaces.`);
        res.status(400).json({
            status: "error-password",
            message: "Password cannot contain whitespaces."
        });
        return;
    }
    userDB[username] = { "password": password };
    //Use fuelQuotes.json file as hardcoded DB
    const fuelQuoteDB = JSON.parse(fs.readFileSync('resources/fuelQuotes.json'));
    fuelQuoteDB[username] = { "numberOfQuotes": 0 };
    res.status(201).json({
        status: "success",
        data: {
            username: username
        }
    });
    //Update JSON files
    fs.writeFileSync('resources/users.json', JSON.stringify(userDB));
    fs.writeFileSync('resources/fuelQuotes.json', JSON.stringify(fuelQuoteDB));
}
router.post("/addUser", addUser);

const deleteUser = (username) => {
    deleteToken(createToken(username)[0]);
    //Use users.json and fuelQuotes.json files as hardcoded DBs
    const userDB = JSON.parse(fs.readFileSync('resources/users.json'));
    const fuelQuoteDB = JSON.parse(fs.readFileSync('resources/fuelQuotes.json'));
    if (!!userDB[username])
        delete userDB[username];
    if (!!fuelQuoteDB[username])
        delete fuelQuoteDB[username];
    //Update JSON files
    fs.writeFileSync('resources/users.json', JSON.stringify(userDB));
    fs.writeFileSync('resources/fuelQuotes.json', JSON.stringify(fuelQuoteDB));
};

module.exports = { router, authentication, logout, addUser, deleteUser };