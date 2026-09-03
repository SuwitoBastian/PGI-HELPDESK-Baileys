const express =
    require("express");

const router =
    express.Router();

const helpdeskGroupController =
    require("../controllers/helpdeskGroupController");

/* ==========================================================
   Helpdesk Groups
========================================================== */

router.get(
    "/",
    helpdeskGroupController.index
);

router.post(
    "/:id/toggle",
    helpdeskGroupController.toggle
);

module.exports = router;