const express = require("express");
const cors = require("cors");
const { shopping, appEvents } = require("./api");
const HandleErrors = require("./utils/error-handler");

// module.exports = async (app) => {
module.exports = async (app, channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  //    listen events
  // appEvents(app);

  //api
  // customer(app);
  // products(app);
  // shopping(app);

  shopping(app, channel);

  // error handling
  app.use(HandleErrors);
};
