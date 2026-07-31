const feedbackService = require("../services/feedbackService");

/* ==========================================================
   Submit Feedback
========================================================== */

function submitFeedback(req, res) {

    try {

        const result =
            feedbackService.submitFeedback(req.body);

        return res.status(201).json({

            success: true,

            message: "Feedback berhasil dikirim.",

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

        const limit = Math.max(
            Number(req.query.limit) || 5,
            1
        );

        const feedback =
            feedbackService.getLatestFeedback(limit);

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
   All Feedback
========================================================== */

function getAllFeedback(req, res) {

    try {

        const filters = {

            startDate: req.query.startDate || null,

            endDate: req.query.endDate || null,

            team: req.query.team || "ALL",

            keyword: req.query.keyword || ""

        };

        const feedback =
            feedbackService.getAllFeedback(filters);

        const statistics =
            feedbackService.getStatistics(filters);

        return res.json({

            success: true,

            data: feedback,

            statistics

        });

    } catch (err) {

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

        const filters = {

            startDate: req.query.startDate || null,

            endDate: req.query.endDate || null,

            team: req.query.team || "ALL",

            keyword: req.query.keyword || ""

        };

        const statistics =
            feedbackService.getStatistics(filters);

        return res.json({

            success: true,

            data: statistics

        });

    } catch (err) {

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

        const filters = {

            startDate: req.query.startDate || null,

            endDate: req.query.endDate || null,

            team: req.query.team || "ALL",

            keyword: req.query.keyword || ""

        };

        await feedbackService.exportExcel(

            filters,

            res

        );

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

module.exports = {

    submitFeedback,

    getLatestFeedback,

    getAllFeedback,

    getStatistics,

    exportExcel

};