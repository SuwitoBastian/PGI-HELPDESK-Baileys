const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

const packageInfo = require("./package.json");

app.locals.appVersion = packageInfo.version;

const config = require("./config");


/* ==========================================================
   Database Migration
========================================================== */

const migrate =
    require("./database/migrate");

migrate();


/* ==========================================================
   Scheduler
========================================================== */

const {
    startSLAScheduler
} = require("./scheduler/slaScheduler");

startSLAScheduler();


/* ==========================================================
   WhatsApp
========================================================== */

const whatsapp =
    require("./services/whatsapp");


/* ==========================================================
   Auth Middleware
========================================================== */

const {
    requireAuth
} = require("./middleware/authMiddleware");


/* ==========================================================
   Routes
========================================================== */

const apiRoute =
    require("./routes/apiRoute");

const authRoutes =
    require("./routes/authRoutes");

const dashboardRoute =
    require("./routes/dashboardRoute");

const operationalRotationRoutes =
    require("./routes/operationalRotationRoutes");

const trendRoutes =
    require("./routes/trend");

const exportRoutes =
    require("./routes/exportRoutes");

const analyticsRoutes =
    require("./routes/analyticsRoutes");

const feedbackRoutes =
    require("./routes/feedbackRoutes");

const engineerRoutes =
    require("./routes/engineerRoutes");

const operationalAssignmentRoutes =
    require("./routes/operationalAssignmentRoutes");

const knowledgeRoutes =
    require("./routes/knowledgeRoutes");

const helpdeskGroupRoutes =
    require("./routes/helpdeskGroupRoutes");


/* ==========================================================
   Express
========================================================== */

app.set(
    "view engine",
    "ejs"
);

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);


/* ==========================================================
   WEB SESSION
========================================================== */

app.use(
    session({

        secret:
            process.env.SESSION_SECRET ||
            "PGI-HELPDESK-CHANGE-THIS-SECRET",

        resave: false,

        saveUninitialized: false,

        cookie: {

            httpOnly: true,

            sameSite: "lax",

            secure: false,

            maxAge:
                1000 *
                60 *
                60 *
                2

        }

    })
);


/* ==========================================================
   STATIC PUBLIC
========================================================== */

app.use(
    express.static("public")
);


/* ==========================================================
   AUTH
========================================================== */

app.use(
    authRoutes
);


/* ==========================================================
   PUBLIC KNOWLEDGE BASE
========================================================== */

/*
    GET Knowledge Base dapat diakses Guest.

    Endpoint CREATE / UPDATE / DELETE
    tetap dilindungi oleh requireAuth
    di dalam knowledgeRoutes.js.
*/

app.use(
    "/api/knowledge",
    knowledgeRoutes
);


/* ==========================================================
   CUSTOMER FEEDBACK API
========================================================== */

/*
    POST /api/feedback
    menggunakan API Key.

    Endpoint GET / reminder
    dilindungi oleh requireAuth
    di dalam feedbackRoutes.js.

    Posisi route feedback HARUS berada
    sebelum private /api router.
*/

app.use(
    "/api/feedback",
    feedbackRoutes
);


/* ==========================================================
   PRIVATE API ROUTES
========================================================== */

/*
    Semua endpoint di bawah ini membutuhkan
    session Master yang valid.
*/

app.use(
    "/api",
    requireAuth,
    apiRoute
);

app.use(
    "/api/operational-rotation",
    requireAuth,
    operationalRotationRoutes
);

app.use(
    "/api/helpdesk-groups",
    requireAuth,
    helpdeskGroupRoutes
);

app.use(
    "/api/trend",
    requireAuth,
    trendRoutes
);

app.use(
    "/api/analytics",
    requireAuth,
    analyticsRoutes
);

app.use(
    "/api/export",
    requireAuth,
    exportRoutes
);

app.use(
    "/api/engineers",
    requireAuth,
    engineerRoutes
);

app.use(
    "/api/operational-assignment",
    requireAuth,
    operationalAssignmentRoutes
);


/* ==========================================================
   Legacy Dashboard
========================================================== */

app.use(
    "/legacy",
    dashboardRoute
);


/* ==========================================================
   React Dashboard
========================================================== */

const distDir =
    path.join(
        __dirname,
        "frontend",
        "dist"
    );

app.use(
    express.static(distDir)
);


/* ==========================================================
   React SPA FALLBACK
========================================================== */

app.use(
    (req, res, next) => {

        if (
            req.method !== "GET" ||
            req.path.startsWith("/api") ||
            req.path === "/login"
        ) {

            return next();

        }

        res.sendFile(

            path.join(
                distDir,
                "index.html"
            ),

            err => {

                if (err) {

                    next(err);

                }

            }

        );

    }
);


/* ==========================================================
   Start Server
========================================================== */

async function start() {

    await whatsapp.connect();

    app.listen(
        config.PORT,
        () => {

            console.log(
                `🚀 Server berjalan di port ${config.PORT}`
            );

        }
    );

}

start().catch(
    err => {

        console.error(err);

    }
);