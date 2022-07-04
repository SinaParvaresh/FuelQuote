const app = require("./app.js");
const port = 5000;
app.listen(port, () => {
    console.log(`Fuel Quote Server listening on port ${port}`);
});