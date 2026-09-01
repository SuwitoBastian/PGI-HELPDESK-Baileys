const express = require("express");

const router = express.Router();

const feedbackController =
    require("../controllers/feedbackController");

const {
    requireAuth
} = require("../middleware/authMiddleware");

const {
    requireFeedbackApiKey
} = require("../middleware/feedbackApiKeyMiddleware");


/* ==========================================================
   Customer Feedback API
========================================================== */


/**
 * Submit Customer Feedback
 *
 * Dipanggil oleh Google Apps Script.
 *
 * Authentication:
 * X-Feedback-API-Key
 *
 * POST /api/feedback
 */
router.post(
    "/",
    requireFeedbackApiKey,
    feedbackController.submitFeedback
);


/**
 * Test Feedback Reminder
 *
 * Hanya untuk user yang sudah login.
 *
 * POST /api/feedback/reminder/test
 */
router.post(
    "/reminder/test",
    requireAuth,
    feedbackController.testFeedbackReminder
);


/**
 * Start Feedback Reminder
 *
 * Hanya untuk user yang sudah login.
 *
 * POST /api/feedback/reminder
 */
router.post(
    "/reminder",
    requireAuth,
    feedbackController.startFeedbackReminder
);


/**
 * Get All Feedback
 *
 * Dashboard / Admin.
 *
 * GET /api/feedback
 */
router.get(
    "/",
    requireAuth,
    feedbackController.getAllFeedback
);


/**
 * Get Latest Feedback
 *
 * Dashboard.
 *
 * GET /api/feedback/latest
 */
router.get(
    "/latest",
    requireAuth,
    feedbackController.getLatestFeedback
);


/**
 * Get Feedback Statistics
 *
 * Dashboard.
 *
 * GET /api/feedback/statistics
 */
router.get(
    "/statistics",
    requireAuth,
    feedbackController.getStatistics
);


/**
 * Export Customer Feedback
 *
 * Dashboard / Admin.
 *
 * GET /api/feedback/export
 */
router.get(
    "/export",
    requireAuth,
    feedbackController.exportExcel
);


module.exports = router;