const fs = require("fs");
const crypto = require('crypto');

const ONE_MINUTE = 60000;

const createSaltforToken = () => {
    const tokenDB = JSON.parse(fs.readFileSync(`resources/tokens.json`));
    if (tokenDB["DBsalt"] != null)
        return;
    tokenDB["DBsalt"] = crypto.randomBytes(8).toString('hex').slice(0, 16);
    fs.writeFileSync(`resources/tokens.json`, JSON.stringify(tokenDB));
}

const createToken = (username) => {
    //Use tokens.json file as hardcoded DB
    const tokenDB = JSON.parse(fs.readFileSync(`resources/tokens.json`));
    let userToken = Object.keys(tokenDB).find(tok => tokenDB[tok].userID == username);
    if (!checkIfExpired(userToken))
        return userToken;
    const randomness = Math.round(Math.random() * (10 ** 16)).toString()
    const hash = crypto.createHmac('sha1', tokenDB.DBsalt); /** Hashing algorithm sha512 */
    userToken = hash.update(username + randomness).digest('hex');
    const expiresInMilisec = (15 * ONE_MINUTE);
    tokenDB[userToken] = { userID: username, expiration: (Date.now() + expiresInMilisec) };
    //Update JSON files
    fs.writeFileSync(`resources/tokens.json`, JSON.stringify(tokenDB));
    return [userToken, expiresInMilisec];
}

const validateToken = (token, res) => {
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
    if (checkIfExpired(token)) {
        console.error("Invalid token:", token);
        res.status(403).json({
            status: "error-token",
            cause: "invalid",
            message: "Token is invalid. Please login again."
        });
        return undefined;
    }
    return tokenDB[token].userID;
}

const checkIfExpired = (token) => {
    const tokenDB = JSON.parse(fs.readFileSync(`resources/tokens.json`));
    if (!tokenDB[token])
        return true;
    if (tokenDB[token].expiration > Date.now())
        return false;
    delete tokenDB[token];
    //Update JSON files
    fs.writeFileSync(`resources/tokens.json`, JSON.stringify(tokenDB));
    return true;
}

const deleteToken = (token) => {
    //Use tokens.json file as hardcoded DB
    const tokenDB = JSON.parse(fs.readFileSync(`resources/tokens.json`));
    if (!tokenDB[token])
        return;
    delete tokenDB[token];
    //Update JSON files
    fs.writeFileSync(`resources/tokens.json`, JSON.stringify(tokenDB));
}

module.exports = { createSaltforToken, createToken, validateToken, deleteToken }