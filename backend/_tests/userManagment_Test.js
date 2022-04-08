// const authentication = require("../routes/userManagement").authentication;

// describe("Authentication function", () => {
//   const res = {};//how do i set this up?
//   test("should authenticate correctly", () => {
//     const req = { body: { "username": "test1@email.com", "password": "some_password1" } };
//     authentication(req, res);
//     expect(res.status).toEqual('success');
//   });
// });


const app = require("../app.js");
const request = require("supertest");
const fs = require("fs");
const { deleteUser } = require("../routes/userManagement.js");

exports.userSuite = () => describe("/userManagement", () => {
  beforeAll(() => {
    const userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
    userDB["test1@email.com"] = { "password": "some_password1" };
    fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));
  })
  describe("/authentication", () => {
    it("should permit valid login and provide a token with expiration", async () => {
      const response = await request(app).post("/userManagement/authentication").send({
        "username": "test1@email.com",
        "password": "some_password1"
      })
      expect(response.statusCode).toBe(200);
      expect(response.body.data.token).toBeTruthy();
      expect(response.body.data.expiration).toBeTruthy();
    })
    it("should not allow invalid credentials nor provide a token with expiration", async () => {
      const response = await request(app).post("/userManagement/authentication").send({
        "username": "abcdefg@abcd.com",
        "password": "abcdefghijk"
      })
      expect(response.statusCode).toBe(403);
      expect(response.body.data).toBeUndefined();
    })
    it("should not allow empty nor non-string type fields", async () => {
      const response1 = await request(app).post("/userManagement/authentication").send({
        "username": "davebrown@trash.com"
      })
      expect(response1.statusCode).toBe(400);
      expect(response1.body.data).toBeUndefined();
      const response2 = await request(app).post("/userManagement/authentication").send({
        "password": "davethebrave"
      })
      expect(response2.statusCode).toBe(400);
      expect(response2.body.data).toBeUndefined();
      const response3 = await request(app).post("/userManagement/authentication").send({
        "username": "davebrown@trash.com",
        "password": ""
      })
      expect(response3.statusCode).toBe(400);
      expect(response3.body.data).toBeUndefined();
      const response4 = await request(app).post("/userManagement/authentication").send({
        "username": "",
        "password": "davethebrave"
      })
      expect(response4.statusCode).toBe(400);
      expect(response4.body.data).toBeUndefined();
      const password = ["davethebrave"];
      const response5 = await request(app).post("/userManagement/authentication").send({
        "username": "davebrown@trash.com",
        "password": password
      })
      expect(response5.statusCode).toBe(400);
      expect(response5.body.data).toBeUndefined();
      const username = ["davebrown@trash.com"];
      const response6 = await request(app).post("/userManagement/authentication").send({
        "username": username,
        "password": "davethebrave"
      })
      expect(response6.statusCode).toBe(400);
      expect(response6.body.data).toBeUndefined();
    })
  })

  describe("/logout", () => {
    it("should pass with valid token", async () => {
      const response = await request(app).get("/userManagement/logout").set(
        "Token", (await request(app).post("/userManagement/authentication").send({
          "username": "davebrown@trash.com",
          "password": "davethebrave"
        })).body.data.token
      )
      expect(response.statusCode).toBe(200);
    })
    it("should fail with missing token", async () => {
      const response = await request(app).get("/userManagement/logout").set("Username", "davebrown@trash.com")
      expect(response.statusCode).toBe(400);
      expect(response.body.cause).toBe("missing");
    })
    it("should fail with invalid token", async () => {
      const response = await request(app).get("/userManagement/logout").set("Token", "1a2b3c4d5e6f7g8h9i10j")
      expect(response.statusCode).toBe(401);
      expect(response.body.cause).toBe("invalid");
    })
  })

  describe("/addUser", () => {
    it("should add user to database when given valid new user info", async () => {
      deleteUser("test1@email.com");
      const response = await request(app).post("/userManagement/addUser").send({
        "username": "test1@email.com",
        "password": "some_password1"
      })
      expect(response.statusCode).toBe(201);
      expect(response.body.data.username).toBe("test1@email.com");
    })
    it("should fail when given an existing username", async () => {
      const response = await request(app).post("/userManagement/addUser").send({
        "username": "test1@email.com",
        "password": "some_password1"
      })
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-duplicate");
    })
    it("should fail when given a username that is not of valid email format", async () => {
      const response = await request(app).post("/userManagement/addUser").send({
        "username": "test2@email.c",
        "password": "some_password2"
      })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-email");
    })
    it("should fail when given a password that is too short or too long", async () => {
      const response1 = await request(app).post("/userManagement/addUser").send({
        "username": "test2@email.com",
        "password": "1234567"
      })
      expect(response1.statusCode).toBe(400);
      expect(response1.body.status).toBe("error-password");
      const response2 = await request(app).post("/userManagement/addUser").send({
        "username": "test2@email.com",
        "password": "12345678901234567"
      })
      expect(response2.statusCode).toBe(400);
      expect(response2.body.status).toBe("error-password");
    })
    it("should fail when given a password that contains white spaces", async () => {
      const response = await request(app).post("/userManagement/addUser").send({
        "username": "test2@email.com",
        "password": "some password2"
      })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-password");
    })
  })
  afterAll(() => {
    deleteUser("test1@email.com");
  })
});