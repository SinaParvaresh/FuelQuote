const application = require("../app.js");
const request = require("supertest");
const fs = require("fs");
const { deleteUser } = require("../routes/userManagement.js");

const later_date = (numOfDays = 0, additionalDays = 30) => {
  const later_date = new Date();
  return new Date(later_date.setDate(later_date.getDate() + (numOfDays + additionalDays) + 1)).toISOString().split('T')[0];
}
let app, test_token;

exports.fuelQuoteSuite = () => describe("/fuelQuoteManagement", () => {
  beforeAll(async () => {
    app = application.listen(4000, (err) => {
      console.log(`Fuel Quote Server listening on port ${4000}`);
    });
    let userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
    userDB["test1@email.com"] = { "password": "some_password1" };
    fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));
    const response = await request(app).post("/userManagement/authentication").send({
      "username": "test1@email.com",
      "password": "some_password1"
    })
    test_token = response.body.data.token;

    userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
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

    const fuelQuoteDB = JSON.parse(fs.readFileSync('resources/fuelQuotes.json'));
    fuelQuoteDB["test1@email.com"] = { "numberOfQuotes": 0 };
    fs.writeFileSync('resources/fuelQuotes.json', JSON.stringify(fuelQuoteDB));
  })
  describe("/getParamsForQuote", () => {
    it("should give paramaters for quote if profile has been completed", async () => {
      let response = await request(app).get("/fuelQuoteManagement/getParamsForQuote").set("Token", test_token);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.params).toBeTruthy();
      expect(response.body.data.params.address).toBe("A random address, Some City, TX 00000");
      expect(response.body.data.params.quote_factors).toStrictEqual({
        "amount_factor": [0.02, 0.03],
        "gallon_rate": 1.5,
        "history_factor": 0,
        "location_factor": 0.02,
        "profit_factor": 0.1
      });
      expect(response.body.expiration).toBeTruthy();

      let fuelQuoteDB = JSON.parse(fs.readFileSync('resources/fuelQuotes.json'));
      fuelQuoteDB["test1@email.com"] = { "numberOfQuotes": 1 };
      fs.writeFileSync('resources/fuelQuotes.json', JSON.stringify(fuelQuoteDB));

      let userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
      userDB["test1@email.com"]["usa_state"] = "AL"
      fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));

      response = await request(app).get("/fuelQuoteManagement/getParamsForQuote").set("Token", test_token);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.params).toBeTruthy();
      expect(response.body.data.params.address).toBe("A random address, Some City, AL 00000");
      expect(response.body.data.params.quote_factors).toStrictEqual({
        "amount_factor": [0.02, 0.03],
        "gallon_rate": 1.5,
        "history_factor": 0.01,
        "location_factor": 0.04,
        "profit_factor": 0.1
      });
      expect(response.body.expiration).toBeTruthy();

      fuelQuoteDB = JSON.parse(fs.readFileSync('resources/fuelQuotes.json'));
      fuelQuoteDB["test1@email.com"] = { "numberOfQuotes": 0 };
      fs.writeFileSync('resources/fuelQuotes.json', JSON.stringify(fuelQuoteDB));

      userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
      userDB["test1@email.com"]["usa_state"] = "TX"
      fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));
    })
    it("should fail if profile has not been completed ", async () => {
      let userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
      userDB["test1@email.com"] = { "password": "some_password1" };
      fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));

      const response = await request(app).get("/fuelQuoteManagement/getParamsForQuote").set("Token", test_token);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-profile");
      expect(response.body.expiration).toBeTruthy();

      userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
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
    })
  })

  describe("/addQuote", () => {
    it("should add quote to database for user if information is valid", async () => {
      let response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "1",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(201);
      expect(response.body.data.quotes).toBeTruthy();
      expect(response.body.data.quotes).toStrictEqual({
        "deliveryAddress": "A random address, Some City, TX 00000",
        "deliveryDate": later_date(),
        "gallonRate": "1.725",
        "numOfGallons": "1",
        "totalCost": "1.73"
      });
      expect(response.body.expiration).toBeTruthy();

      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "1001",
          "deliveryDate": later_date(1)
        })
      expect(response.statusCode).toBe(201);
      expect(response.body.data.quotes).toBeTruthy();
      expect(response.body.data.quotes).toStrictEqual({
        "deliveryAddress": "A random address, Some City, TX 00000",
        "deliveryDate": later_date(1),
        "gallonRate": "1.695",
        "numOfGallons": "1001",
        "totalCost": "1696.70"
      });
      expect(response.body.expiration).toBeTruthy();

      let userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
      userDB["test1@email.com"]["usa_state"] = "AL"
      fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));

      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, AL 00000",
          "numOfGallons": "1",
          "deliveryDate": later_date(2)
        })
      expect(response.statusCode).toBe(201);
      expect(response.body.data.quotes).toBeTruthy();
      expect(response.body.data.quotes).toStrictEqual({
        "deliveryAddress": "A random address, Some City, AL 00000",
        "deliveryDate": later_date(2),
        "gallonRate": "1.74",
        "numOfGallons": "1",
        "totalCost": "1.74"
      });
      expect(response.body.expiration).toBeTruthy();

      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, AL 00000",
          "numOfGallons": "1001",
          "deliveryDate": later_date(2)
        })
      expect(response.statusCode).toBe(201);
      expect(response.body.data.quotes).toBeTruthy();
      expect(response.body.data.quotes).toStrictEqual({
        "deliveryAddress": "A random address, Some City, AL 00000",
        "deliveryDate": later_date(2),
        "gallonRate": "1.725",
        "numOfGallons": "1001",
        "totalCost": "1726.73"
      });
      expect(response.body.expiration).toBeTruthy();

      userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
      userDB["test1@email.com"]["usa_state"] = "TX"
      fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));
    })

    it("should fail if profile info has not been completed", async () => {
      let userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
      userDB["test1@email.com"] = { "password": "some_password1" };
      fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));

      let response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "1",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-profile");
      expect(response.body.expiration).toBeTruthy();

      userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
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
    })
    it("should fail if any field is empty or not of string type", async () => {
      let response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "numOfGallons": "1",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "",
          "numOfGallons": "1",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": ["A random address, Some City, TX 00000"],
          "numOfGallons": "1",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();

      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": 1,
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();

      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "1"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "1",
          "deliveryDate": ""
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "1",
          "deliveryDate": [later_date()]
        })
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error-field_type");
      expect(response.body.expiration).toBeTruthy();
    })

    it("should fail if number of requested gallons is not a whole value", async () => {
      let response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "1.5",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-gallons");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "1.0",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(201);
      expect(response.body.data.quotes).toBeTruthy();
      expect(response.body.data.quotes).toStrictEqual({
        "deliveryAddress": "A random address, Some City, TX 00000",
        "deliveryDate": later_date(),
        "gallonRate": "1.71",
        "numOfGallons": "1.0",
        "totalCost": "1.71"
      });
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail if number of requested gallons is less than 1 or greater than 1,000,000", async () => {
      let response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "0",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-gallons");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "1000001",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-gallons");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail if requested date is before tomorrow's date", async () => {
      const response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00000",
          "numOfGallons": "1",
          "deliveryDate": later_date(-30, 0)
        })
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-delivery_date");
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail if requested address does not match that of the user's profile", async () => {
      let response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A rando address, Some City, TX 00000",
          "numOfGallons": "1",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-address");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some Cit, TX 00000",
          "numOfGallons": "1",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-address");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TN 00000",
          "numOfGallons": "1",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-address");
      expect(response.body.expiration).toBeTruthy();
      response = await request(app).post("/fuelQuoteManagement/addQuote").set(
        "Token", test_token).send({
          "deliveryAddress": "A random address, Some City, TX 00001",
          "numOfGallons": "1",
          "deliveryDate": later_date()
        })
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-address");
      expect(response.body.expiration).toBeTruthy();
    })
  })
  describe("/getQuotes", () => {
    it("should retrieve quotes if profile has been completed", async () => {
      const response = await request(app).get("/fuelQuoteManagement/getQuotes").set("Token", test_token);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.quotes).toBeTruthy();
      expect(response.body.data.quotes).toStrictEqual({
        "numberOfQuotes": 5,
        "q1": {
          "deliveryAddress": "A random address, Some City, TX 00000",
          "deliveryDate": later_date(),
          "gallonRate": "1.725",
          "numOfGallons": "1",
          "totalCost": "1.73"
        },
        "q2": {
          "deliveryAddress": "A random address, Some City, TX 00000",
          "deliveryDate": later_date(1),
          "gallonRate": "1.695",
          "numOfGallons": "1001",
          "totalCost": "1696.70"
        },
        "q3": {
          "deliveryAddress": "A random address, Some City, AL 00000",
          "deliveryDate": later_date(2),
          "gallonRate": "1.74",
          "numOfGallons": "1",
          "totalCost": "1.74"
        },
        "q4": {
          "deliveryAddress": "A random address, Some City, AL 00000",
          "deliveryDate": later_date(2),
          "gallonRate": "1.725",
          "numOfGallons": "1001",
          "totalCost": "1726.73"
        },
        "q5": {
          "deliveryAddress": "A random address, Some City, TX 00000",
          "deliveryDate": later_date(),
          "gallonRate": "1.71",
          "numOfGallons": "1.0",
          "totalCost": "1.71"
        },
      });
      expect(response.body.expiration).toBeTruthy();
    })
    it("should fail if profile has not been completed", async () => {
      const userDB = JSON.parse(fs.readFileSync('./resources/users.json'));
      userDB["test1@email.com"] = { "password": "some_password1" };
      fs.writeFileSync('./resources/users.json', JSON.stringify(userDB));
      const response = await request(app).get("/fuelQuoteManagement/getQuotes").set("Token", test_token);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error-profile");
      expect(response.body.expiration).toBeTruthy();
    })
  })
  afterAll((done) => {
    deleteUser("test1@email.com");
    app.close(done);
  })
});