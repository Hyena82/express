require("dotenv").config();

const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./dbs/connectMongodb");

// const { checkOverload } = require("./helpers/checkConnect");
// checkOverload();

// init router
app.use("/", require("./routes"));

// handling error

module.exports = app;
