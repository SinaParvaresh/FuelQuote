const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const userManagement = require("./routes/userManagement");
const profileManagement = require("./routes/profileManagement");
const fuelQuoteManagement = require("./routes/fuelQuoteManagement");

app.use(cors())
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/userManagement", userManagement)
app.use("/profileManagement", profileManagement);
app.use("/fuelQuoteManagement", fuelQuoteManagement);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
