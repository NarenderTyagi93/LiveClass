const express = require("express");
const Serivce = require("../services");
const Utils = require("../utils");

const routes = express.Router();

routes.route("/health-check").get(async (req, res) => {
  res.status(200).json({ message: "Simpplr-Yelp HEALTH: OK!" });
});

routes.route("/business/:location").get(async (req, res) => {
  try {
    const {
      limit = 10,
      offset = 0,
      category = "Ice Cream %26 Frozen Yogurt (icecream, All)",
    } = req.query; // by default
    const { location = "Redwood City" } = req.params;
    const result = await Serivce.getBusinessList(
      limit,
      offset,
      location,
      category
    );
    const { status } = result;
    if (!result.success) {
      return Utils.sendResponse(res, status.code, {}, status.info);
    }

    const { list } = result.data;
    const responseData = {
      list,
      limit,
      offset,
    };
    console.log(responseData);
    return Utils.sendResponse(res, status.code, responseData, status.info);
  } catch (err) {
    console.error(err);
    return Utils.sendResponse(res, 500, {}, "Something Went Wrong!");
  }
});

routes.route("/business/:id/review").get(async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Serivce.getReviewData(id);
    const { status } = result;
    if (!result.success) {
      return Utils.sendResponse(res, status.code, {}, status.info);
    }

    const responseData = result.data;
    console.log(responseData);
    return Utils.sendResponse(res, status.code, responseData, status.info);
  } catch (err) {
    console.error(err);
    return Utils.sendResponse(res, 500, {}, "Something Went Wrong!");
  }
});

module.exports = routes;
