const express = require("express");

const routes = express.Router();

routes.route("/health-check").get(async (req, res) => {
  res.status(200).json({ message: "Simpplr-Yelp HEALTH: OK!" });
});

module.exports = routes;
