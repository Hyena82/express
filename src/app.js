const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/connectMongodb");

const { checkOverload } = require("./helpers/checkConnect");
checkOverload();
// init router

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "hihihihi".repeat(10000),
  });
});

// handling error

module.exports = app;
