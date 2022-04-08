const { profileSuite } = require("./_tests/profileManagment_Test.js");
const { userSuite } = require("./_tests/userManagment_Test.js");

describe('sequentially run tests', () => {
    userSuite();
    profileSuite();
})