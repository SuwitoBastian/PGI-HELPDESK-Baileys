const operationalAssignmentService =
    require("../services/operationalAssignmentService");

/* ==========================================================
   Current Assignment
========================================================== */

function current(req, res) {

    try {

        const assignment =
            operationalAssignmentService.getCurrentAssignment();

        res.json({

            success: true,

            akr: assignment.akr,

            headOffice: assignment.headOffice

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

/* ==========================================================
   Assignment By Rotation
========================================================== */

function byRotation(req, res) {

    try {

        const rotationId =
            Number(req.params.rotationId);

        const assignment =
            operationalAssignmentService.getAssignment(
                rotationId
            );

        res.json({

            success: true,

            akr: assignment.akr,

            headOffice: assignment.headOffice

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

function save(req, res) {

    try {

        const {

            rotationId,

            akrCodes

        } = req.body;

        operationalAssignmentService.save(

            Number(rotationId),

            akrCodes

        );

        res.json({

            success: true,

            message: "Assignment berhasil disimpan."

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
   Export
========================================================== */

module.exports = {

    current,

    byRotation,

    save

};