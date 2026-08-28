const feedbackReminderService =
    require("../services/feedbackReminderService");

const feedbackService =
    require("../services/feedbackService");

const ticketRepository =
    require("../repositories/ticketRepository");


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
                id:
                    result.lastInsertRowid
            }

        });

    } catch (err) {

        return res.status(400).json({

            success: false,

            message:
                err.message

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

            data:
                feedback

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message:
                err.message

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

            data:
                feedback,

            statistics

        });

    } catch (err) {

        console.error(
            "GET ALL FEEDBACK ERROR:",
            err
        );


        return res.status(500).json({

            success: false,

            message:
                err.message

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

            data:
                statistics

        });

    } catch (err) {

        console.error(
            "GET FEEDBACK STATISTICS ERROR:",
            err
        );


        return res.status(500).json({

            success: false,

            message:
                err.message

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

            message:
                err.message

        });

    }

}


/* ==========================================================
   Test Feedback Reminder
========================================================== */

/* ==========================================================
   Test Feedback Reminder
========================================================== */

async function testFeedbackReminder(req, res) {

    try {

        const {
            referenceDate
        } = req.body;


        /*
         * referenceDate digunakan khusus untuk
         * simulasi bulan reminder.
         *
         * Contoh:
         *
         * {
         *     "referenceDate": "2026-09-02"
         * }
         *
         * Kalau tidak dikirim,
         * gunakan tanggal sekarang.
         */

        const result =
            await feedbackReminderService.runReminder(
                referenceDate || null
            );


        return res.json({

            success: true,

            data:
                result

        });


    } catch (err) {

        console.error(
            "TEST FEEDBACK REMINDER ERROR:",
            err
        );


        return res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

}


/* ==========================================================
   Production Feedback Reminder
========================================================== */

function startFeedbackReminder(req, res) {

    try {

        /*
         * Jalankan proses di background.
         *
         * Tidak menggunakan await.
         *
         * Jadi HTTP response langsung dikembalikan
         * tanpa menunggu seluruh batch selesai.
         */

        feedbackReminderService
            .runReminder()
            .then((result) => {

                console.log(
                    "✅ Background Feedback Reminder selesai"
                );

                console.log(
                    result
                );

            })
            .catch((err) => {

                console.error(
                    "❌ Background Feedback Reminder gagal"
                );

                console.error(
                    err
                );

            });


        return res.status(202).json({

            success: true,

            message:
                "Feedback Reminder berhasil dimulai."

        });

    } catch (err) {

        console.error(
            "START FEEDBACK REMINDER ERROR:",
            err
        );


        return res.status(500).json({

            success: false,

            message:
                err.message

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

    exportExcel,

    testFeedbackReminder,

    startFeedbackReminder

};