const express = require("express");

const router = express.Router();

const trendController = require("../controllers/trendController");

router.get(
    "/daily",
    trendController.getDailyTrend
);

module.exports = router;