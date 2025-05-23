const express = require("express");
const cors = require("cors");
const { products, appEvents } = require("./api");
const HandleErrors = require("./utils/error-handler");
// module.exports = async (app) => {
module.exports = async (app, channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  //   listen to app events
  // appEvents(app); //when using channel no need of appevents at all
  //api
  // customer(app);
  // products(app);
  products(app, channel);
  // shopping(app);

  // error handling
  app.use(HandleErrors);
};
