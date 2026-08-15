const operationalRotationService =
    require("../services/operationalRotationService");

const engineerService =
    require("../services/engineerService");

/* ==========================================================
   Index
========================================================== */

function index(req, res) {

    try {

        const current =
            operationalRotationService.getCurrentRotation();

        const next =
            operationalRotationService.getNextRotation();

        const schedule =
            operationalRotationService.getAllRotation();

        const engineers =
            engineerService.getAll();

        res.json({

            current,

            next,

            schedule,

            engineers

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

}

/* ==========================================================
   Update Rotation
========================================================== */

function update(req, res) {

    try {

        const {

            year,

            month,

            primaryTeam,

            backupTeam

        } = req.body;

        operationalRotationService.updateRotation(

            Number(year),

            Number(month),

            primaryTeam,

            backupTeam,

            req.session?.user?.kode || "SYSTEM"

        );

        res.json({

            success: true

        });

    }

    catch (err) {

        console.error(err);

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

/* ==========================================================
   Save Primary Team
========================================================== */

module.exports = {

    index,

    update

};