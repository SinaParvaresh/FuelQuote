const { userSuite } = require("./_tests/userManagment_Test.js");
const { profileSuite } = require("./_tests/profileManagment_Test.js");
const { fuelQuoteSuite } = require("./_tests/fuelQuoteManagment_Test.js");

describe('sequentially run tests', () => {
    userSuite();
    profileSuite();
    fuelQuoteSuite();
})