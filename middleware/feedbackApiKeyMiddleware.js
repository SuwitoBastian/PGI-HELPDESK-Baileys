function requireFeedbackApiKey(req, res, next) {

    console.log("=== FEEDBACK API KEY MIDDLEWARE ===");
    console.log(
        "HEADER ADA:",
        Boolean(req.get("X-Feedback-API-Key"))
    );
    console.log(
        "EXPECTED ADA:",
        Boolean(process.env.FEEDBACK_API_KEY)
    );

    const expectedKey =
        process.env.FEEDBACK_API_KEY;

    const receivedKey =
        req.get("X-Feedback-API-Key");

    if (
        !expectedKey ||
        !receivedKey ||
        receivedKey !== expectedKey
    ) {

        console.log("❌ API KEY DITOLAK");

        return res.status(401).json({
            ok: false,
            message: "Unauthorized"
        });

    }

    console.log("✅ API KEY VALID");

    return next();
}


module.exports = {
    requireFeedbackApiKey
};