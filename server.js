const cors = require("cors");
const express = require("express");
require('dotenv').config()
require("./src/s3config")
const app = express();


global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

let port = process.env.PORT;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
