const express = require("express");

const router = express.Router();

const operationalRotationController =
    require("../controllers/operationalRotationController");

/* ==========================================================
   Operational Rotation
========================================================== */

router.get(
    "/",
    operationalRotationController.index
);

router.post(
    "/update",
    operationalRotationController.update
);

module.exports = router;