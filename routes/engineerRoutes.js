const express = require("express");

const router = express.Router();

const engineerController =
    require("../controllers/engineerController");

/* ==========================================================
   Engineers
========================================================== */

router.get(

    "/",

    engineerController.getAll

);

router.post(

    "/",

    engineerController.create

);

router.put(

    "/:code",

    engineerController.update

);

module.exports = router;