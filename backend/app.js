const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const profileManagement = require("./routes/profileManagement");

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/profileManagement", profileManagement);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
