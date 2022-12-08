const fs = require("fs");
const crypto = require('crypto');

const ONE_MINUTE = 60000;
const expiresInMilisec = (15 * ONE_MINUTE);

const createSaltforToken = () => {
    const tokenDB = JSON.parse(fs.readFileSync('resources/tokens.json'));
    if (!!tokenDB["DBsalt"])
        return;
    tokenDB["DBsalt"] = crypto.randomBytes(8).toString('hex').slice(0, 16);
    fs.writeFileSync('resources/tokens.json', JSON.stringify(tokenDB));
}

const createToken = (username) => {
    ///First checks if valid token exists for the user.
    //Use tokens.json file as hardcoded DB
    let tokenDB = JSON.parse(fs.readFileSync('resources/tokens.json'));
    let userToken = Object.keys(tokenDB).find(tok => tokenDB[tok].userID == username);
    if (!checkIfExpired(userToken)) {
        tokenDB[userToken].expiration = (Date.now() + expiresInMilisec);
        fs.writeFileSync('resources/tokens.json', JSON.stringify(tokenDB));
        return [userToken, expiresInMilisec];
    }
    ///Creates a new token for the user if one does not exist or has expired.
    tokenDB = JSON.parse(fs.readFileSync('resources/tokens.json'));
    do {
        const randomness = Math.round(Math.random() * (10 ** 16)).toString()
        const hash = crypto.createHmac('sha1', tokenDB.DBsalt); /** Hashing algorithm sha512 */
        userToken = hash.update(username + randomness).digest('hex');
    } while (Object.keys(tokenDB).includes(userToken));
    tokenDB[userToken] = { userID: username, expiration: (Date.now() + expiresInMilisec) };
    //Update JSON files
    fs.writeFileSync('resources/tokens.json', JSON.stringify(tokenDB));
    return [userToken, expiresInMilisec];
}

const validateToken = (token, res) => {
    if (!token) {
        console.error("Missing token.");
        res.status(400).json({
            status: "error-token",
            cause: "missing",
            message: "Token is missing."
        });
        return [];
    }
    if (checkIfExpired(token)) {
        console.error("Invalid token:", token);
        res.status(401).json({
            status: "error-token",
            cause: "invalid",
            message: "Token is invalid. Please login again."
        });
        return [];
    }
    //Use tokens.json file as hardcoded DB
    const tokenDB = JSON.parse(fs.readFileSync('resources/tokens.json'));
    tokenDB[token].expiration = (Date.now() + expiresInMilisec);
    return [tokenDB[token].userID, expiresInMilisec];
}

const checkIfExpired = (token) => {
    const tokenDB = JSON.parse(fs.readFileSync('resources/tokens.json'));
    if (!tokenDB[token])
        return true;
    if (tokenDB[token].expiration > Date.now())
        return false;
    delete tokenDB[token];
    //Update JSON files
    fs.writeFileSync('resources/tokens.json', JSON.stringify(tokenDB));
    return true;
}

const deleteToken = (token) => {
    //Use tokens.json file as hardcoded DB
    const tokenDB = JSON.parse(fs.readFileSync('resources/tokens.json'));
    if (!tokenDB[token])
        return;
    delete tokenDB[token];
    //Update JSON files
    fs.writeFileSync('resources/tokens.json', JSON.stringify(tokenDB));
}

module.exports = { createSaltforToken, createToken, validateToken, deleteToken };