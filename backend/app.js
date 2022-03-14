const express = require("express");
const cors = require("cors");
const app = express();
const cors = require('cors')
const port = 5000;
const bodyParser = require("body-parser");
const profileManagement = require("./routes/profileManagement");
const login = require("./routes/login");

app.use(cors())
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/login", login)
app.use("/profileManagement", profileManagement);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
