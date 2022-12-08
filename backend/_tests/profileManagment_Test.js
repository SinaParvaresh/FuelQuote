const application = require("../app.js");
const request = require("supertest");
const fs = require("fs");
const { deleteUser } = require("../routes/userManagement.js");

let app, test_token;

exports.profileSuite = () => describe("/profileManagement", () => {
  beforeAll(async () => {
    app = application.listen(4000, (err) => {
      console.log(`Fuel Quote Server listening on port ${4000}`);
    });
    const userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
    userDB["test1@email.com"] = { "password": "some_password1" };
    fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));
    const response = await request(app).post("/userManagement/authentication").send({
      "username": "test1@email.com",
      "password": "some_password1"
    })
    test_token = response.body.data.token;
  })
  describe("/getProfile", () => {
    it("should give user profile info if it has been completed", async () => {
      const userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
      userDB["test1@email.com"] = {
        "password": "some_password1",
        "full_name": "Some Person",
        "address_1": "A random address",
        "address_2": "",
        "city": "Some City",
        "usa_state": "TX",
        "zipcode": "00000"
      };
      fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));

      const response = await request(app).get("/profileManagement/getProfile").set("Token", test_token);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.profile).toBeTruthy();
      expect(response.body.data.profile).toStrictEqual({
        "full_name": "Some Person",
        "address_1": "A random address",
        "address_2": "",
        "city": "Some City",
        "usa_state": "TX",
        "zipcode": "00000"
      });
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail if profile info has not been completed", async () => {
      const userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
      userDB["test1@email.com"] = { "password": "some_password1" };
      fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));

      const response = await request(app).get("/profileManagement/getProfile").set("Token", test_token);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-profile");
      expect(response.body.expiration).toBeTruthy();
    })
  })
  describe("/updateProfile", () => {
    it("should add valid profile information of user to database", async () => {
      let response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some-one Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(201);
      expect(response.body.data.profile).toBeTruthy();
      expect(response.body.data.profile).toStrictEqual({
        "full_name": "Some-one Person",
        "address_1": "A random address",
        "address_2": "",
        "city": "Some City",
        "usa_state": "TX",
        "zipcode": "00000"
      });
      expect(response.body.expiration).toBeTruthy();

      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(201);
      expect(response.body.data.profile).toBeTruthy();
      expect(response.body.data.profile).toStrictEqual({
        "full_name": "Some Person",
        "address_1": "A random address",
        "address_2": "",
        "city": "Some City",
        "usa_state": "TX",
        "zipcode": "00000"
      });
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail if any field is empty or not of string type", async () => {
      let response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": ["Some Person"],
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": ["A random address"],
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": ["Some City"],
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": ["TX"],
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": ""
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": 10000
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should pass but not add profile information to database", async () => {
      const response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(200);
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail when full name is not of valid format", async () => {
      let response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some1 Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-full_name");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "SomePerson",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-full_name");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail when full name is too long", async () => {
      const response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "SomePersonSomePersonSomePerson SomePersonSomePersonSomePerson",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-full_name");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail when address 1 is not of valid format", async () => {
      let response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": " \n\t ",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-address_1");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A_random_address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-address_1");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A  random  address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-address_1");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail when address 1 is too long", async () => {
      const response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address .......... .......... .......... .......... .......... .......... .......... .......... ..........",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-address_1");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail when address 2 is not of valid format", async () => {
      let response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": " \n\t ",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-address_2");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "A random  address",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-address_2");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail when address 2 is too long", async () => {
      const response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "A random address .......... .......... .......... .......... .......... .......... .......... .......... ..........",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-address_2");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail when city is not of valid format", async () => {
      const response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some1 City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-city");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail when city is too long", async () => {
      const response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City Some City Some City Some City Some City Some City Some City Some City Some City Some City Some City",
          "usa_state": "TX",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-city");
      expect(response.body.expiration).toBeTruthy();
    })

    it("should fail when state does not match any of the 2-character codes for the 50 USA states", async () => {
      const response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "ZZ",
          "zipcode": "00000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-state");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail when zipecode is not of valid format", async () => {
      const response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "00a00"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-zipcode");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail when zipecode is too short or too long", async () => {
      let response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "0000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-zipcode");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/profileManagement/updateProfile").set(
        "Token", test_token).send({
          "full_name": "Some Person",
          "address_1": "A random address",
          "address_2": "",
          "city": "Some City",
          "usa_state": "TX",
          "zipcode": "0000000000"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-zipcode");
      expect(response.body.expiration).toBeTruthy();
    })
  })
  afterAll((done) => {
    deleteUser("test1@email.com");
    app.close(done);
  })
});