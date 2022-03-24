const authentication = require("../routes/userManagement").authentication;

describe("Authentication function", () => {
  const res = {};//how do i set this up?
  test("should authenticate correctly", () => {
    const req = { body: { "username": "test1@email.com", "password": "some_password1" } };
    authentication(req, res);
    expect(res.status).toEqual('success');
  });
});