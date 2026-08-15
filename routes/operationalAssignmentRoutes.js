const express =
    require("express");

const router =
    express.Router();

const operationalAssignmentController =
    require("../controllers/operationalAssignmentController");

/* ==========================================================
   Current Assignment
========================================================== */

router.get(

    "/current",

    operationalAssignmentController.current

);

/* ==========================================================
   Assignment By Rotation
========================================================== */

router.get(

    "/:rotationId",

    operationalAssignmentController.byRotation

);

router.post(

    "/",

    operationalAssignmentController.save

);

/* ==========================================================
   Export
========================================================== */

module.exports = router;