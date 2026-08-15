const feedbackService = require("../services/feedbackService");

/* ==========================================================
   Submit Feedback
========================================================== */

function submitFeedback(req, res) {

    try {

        const result =
            feedbackService.submitFeedback(
                req.body
            );

        return res.status(201).json({

            success: true,

            message:
                "Feedback berhasil dikirim.",

            data: {
                id: result.lastInsertRowid
            }

        });

    } catch (err) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

}


/* ==========================================================
   Latest Feedback
========================================================== */

function getLatestFeedback(req, res) {

    try {

        const limit =
            Math.max(
                Number(req.query.limit) || 5,
                1
            );


        const feedback =
            feedbackService.getLatestFeedback(
                limit
            );


        return res.json({

            success: true,

            data: feedback

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

}


/* ==========================================================
   Build Filters
========================================================== */

function buildFilters(req) {

    return {

        startDate:
            req.query.startDate || null,

        endDate:
            req.query.endDate || null,

        location:
            req.query.location || null,

        /*
         * Team tetap diterima untuk
         * compatibility dengan frontend
         * atau request lama.
         */

        team:
            req.query.team || "ALL",

        keyword:
            req.query.keyword || ""

    };

}


/* ==========================================================
   All Feedback
========================================================== */

function getAllFeedback(req, res) {

    try {

        const filters =
            buildFilters(req);


        const feedback =
            feedbackService.getAllFeedback(
                filters
            );


        const statistics =
            feedbackService.getStatistics(
                filters
            );


        return res.json({

            success: true,

            data: feedback,

            statistics

        });

    } catch (err) {

        console.error(
            "GET ALL FEEDBACK ERROR:",
            err
        );


        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

}


/* ==========================================================
   Statistics
========================================================== */

function getStatistics(req, res) {

    try {

        const filters =
            buildFilters(req);


        const statistics =
            feedbackService.getStatistics(
                filters
            );


        return res.json({

            success: true,

            data: statistics

        });

    } catch (err) {

        console.error(
            "GET FEEDBACK STATISTICS ERROR:",
            err
        );


        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

}


/* ==========================================================
   Export Excel
========================================================== */

async function exportExcel(req, res) {

    try {

        const filters =
            buildFilters(req);


        await feedbackService.exportExcel(
            filters,
            res
        );

    } catch (err) {

        console.error(
            "EXPORT FEEDBACK ERROR:",
            err
        );


        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

}


/* ==========================================================
   Export
========================================================== */

module.exports = {

    submitFeedback,

    getLatestFeedback,

    getAllFeedback,

    getStatistics,

    exportExcel

};