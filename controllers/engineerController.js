const engineerService =
    require("../services/engineerService");

/* ==========================================================
   GET ALL ENGINEERS
========================================================== */

function getAll(req, res) {

    try {

        const engineers =
            engineerService.getAll();

        res.json({

            success: true,

            data: engineers

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
   CREATE ENGINEER
========================================================== */

function create(req, res) {

    try {

        const {

            code,

            name

        } = req.body;

        engineerService.create(

            code,

            name

        );

        res.json({

            success: true,

            message: "Engineer berhasil ditambahkan."

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
   UPDATE ENGINEER
========================================================== */

function update(req, res) {

    try {

        const {

            code

        } = req.params;

        const {

            name

        } = req.body;

        engineerService.update(

            code,

            name

        );

        res.json({

            success: true,

            message: "Engineer berhasil diperbarui."

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
   EXPORT
========================================================== */

module.exports = {

    getAll,

    create,

    update

};