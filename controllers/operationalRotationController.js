const operationalRotationService =
    require("../services/operationalRotationService");

function index(req, res) {

    try {

        const current =
            operationalRotationService.getCurrentRotation();

        const next =
            operationalRotationService.getNextRotation();

const schedule =
    operationalRotationService.getAllRotation();

res.json({

    current,

    next,

    schedule

});

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

}

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

    } catch (err) {

        console.error(err);

        res.status(400).json({

    success: false,

    message: err.message

});

    }

}

module.exports = {

    index,

    update

};