const express = require("express");

const router = express.Router();

const feedbackController =
    require("../controllers/feedbackController");


/* ==========================================================
   Customer Feedback API
========================================================== */


/**
 * Submit Customer Feedback
 * POST /api/feedback
 */
router.post(
    "/",
    feedbackController.submitFeedback
);


/**
 * Test Feedback Reminder
 * POST /api/feedback/reminder/test
 *
 * Test hanya 1 ticket.
 */
router.post(
    "/reminder/test",
    feedbackController.testFeedbackReminder
);


/**
 * Start Feedback Reminder
 * POST /api/feedback/reminder
 *
 * Production:
 * Menjalankan reminder secara background.
 *
 * Batch:
 * - 5 ticket
 * - jeda 10 menit
 */
router.post(
    "/reminder",
    feedbackController.startFeedbackReminder
);


/**
 * Get All Feedback
 * GET /api/feedback
 */
router.get(
    "/",
    feedbackController.getAllFeedback
);


/**
 * Get Latest Feedback
 * GET /api/feedback/latest
 */
router.get(
    "/latest",
    feedbackController.getLatestFeedback
);


/**
 * Get Feedback Statistics
 * GET /api/feedback/statistics
 */
router.get(
    "/statistics",
    feedbackController.getStatistics
);


/**
 * Export Customer Feedback
 * GET /api/feedback/export
 */
router.get(
    "/export",
    feedbackController.exportExcel
);


module.exports = router;