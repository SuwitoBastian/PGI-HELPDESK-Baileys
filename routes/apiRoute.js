const express = require("express");

const router = express.Router();

const apiDashboardController =
    require("../controllers/apiDashboardController");

router.get(
    "/dashboard",
    apiDashboardController.dashboard
);

router.post(
    "/tickets/:id/close",
    apiDashboardController.closeTicket
);

router.post(
    "/tickets/:id/open",
    apiDashboardController.reopenTicket
);

router.post(
    "/tickets/:id/assign",
    apiDashboardController.assignPIC
);

router.post(
    "/tickets/:id/status",
    apiDashboardController.changeStatus
);

module.exports = router;
