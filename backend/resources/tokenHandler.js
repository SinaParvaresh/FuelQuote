const fs = require("fs");
const crypto = require('crypto');

exports.createSaltforToken = () => {
    const tokenDB = JSON.parse(fs.readFileSync(`resources/tokens.json`));
    if (tokenDB["salt"] != null)
        return;
    tokenDB["salt"] = crypto.randomBytes(8).toString('hex').slice(0, 16);
    fs.writeFileSync(`resources/tokens.json`, JSON.stringify(tokenDB));
}

exports.createToken = (username) => {
    //Use tokens.json file as hardcoded DB
    const tokenDB = JSON.parse(fs.readFileSync(`resources/tokens.json`));
    let userToken = Object.keys(tokenDB).find(tok => tokenDB[tok].userID == username);
    if (userToken != undefined)
        return userToken;
    const randomness = Math.round(Math.random() * (10 ** 16)).toString()
    const hash = crypto.createHmac('sha1', tokenDB.salt); /** Hashing algorithm sha512 */
    userToken = hash.update(username + randomness).digest('hex');
    tokenDB[userToken] = { userID: username };
    //Update JSON files
    fs.writeFileSync(`resources/tokens.json`, JSON.stringify(tokenDB));
    return userToken;
}

exports.validateToken = (token, res) => {
    //Use tokens.json file as hardcoded DB
    const tokenDB = JSON.parse(fs.readFileSync(`resources/tokens.json`));
    if (!token) {
        console.error("Missing token");
        res.status(400).json({
            status: "error-token",
            cause: "missing",
            message: "Token is missing."
        });
        return undefined;
    }
    if (!tokenDB[token]) {
        console.error("Invalid token:", token);
        res.status(403).json({
            status: "error-token",
            cause: "invalid",
            message: "Token is invalid. Please login again."
        });
        return undefined;
    }
    // fs.writeFileSync(`resources/tokens.json`, JSON.stringify(tokenDB));
    return tokenDB[token].userID;
}

exports.deleteToken = (token) => {
    //Use tokens.json file as hardcoded DB
    const tokenDB = JSON.parse(fs.readFileSync(`resources/tokens.json`));
    if (!tokenDB[token])
        return;
    delete tokenDB[token];
    //Update JSON files
    fs.writeFileSync(`resources/tokens.json`, JSON.stringify(tokenDB));
}