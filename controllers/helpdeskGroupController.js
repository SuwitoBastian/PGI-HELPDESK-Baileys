const helpdeskGroupService =
    require("../services/helpdeskGroupService");

/* ==========================================================
   Get All Groups
========================================================== */

function index(req, res) {

    try {

        const groups =
            helpdeskGroupService.getAll();

        res.json({

            success: true,

            groups

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
   Toggle Group
========================================================== */

function toggle(req, res) {

    try {

        const id =
            Number(req.params.id);

        if (!Number.isInteger(id)) {

            throw new Error(
                "ID grup tidak valid."
            );

        }

        const group =
            helpdeskGroupService.toggle(id);

        res.json({

            success: true,

            group

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

    index,

    toggle

};