function isAuthenticated(req) {

    return Boolean(
        req.session &&
        req.session.user
    );

}


// ==========================================================
// REQUIRE AUTH
// ==========================================================

function requireAuth(req, res, next) {

    if (
        isAuthenticated(req)
    ) {

        return next();

    }


    // ======================================================
    // API REQUEST
    // ======================================================

    if (
        req.originalUrl.startsWith("/api/")
    ) {

        return res.status(401).json({

            ok: false,

            message:
                "Unauthorized"

        });

    }


    // ======================================================
    // WEB REQUEST
    // ======================================================

    return res.redirect(
        "/login"
    );

}


// ==========================================================
// REQUIRE GUEST
// ==========================================================

function requireGuest(req, res, next) {

    if (
        isAuthenticated(req)
    ) {

        return res.redirect(
            "/"
        );

    }


    return next();

}


module.exports = {

    requireAuth,

    requireGuest

};