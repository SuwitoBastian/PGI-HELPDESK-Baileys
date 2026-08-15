const express = require("express");
const path = require("path");

const app = express();

const config = require("./config");

/* ==========================================================
   Database Migration
========================================================== */

const migrate = require("./database/migrate");

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
   Routes
========================================================== */

const apiRoute =
    require("./routes/apiRoute");

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

/* ==========================================================
   Express
========================================================== */

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    express.static("public")
);

/* ==========================================================
   API Routes
========================================================== */

app.use(
    "/api",
    apiRoute
);

app.use(
    "/api/operational-rotation",
    operationalRotationRoutes
);

app.use(
    "/api/trend",
    trendRoutes
);

app.use(
    "/api/analytics",
    analyticsRoutes
);

app.use(
    "/api/export",
    exportRoutes
);

app.use(
    "/api/feedback",
    feedbackRoutes
);

app.use(
    "/api/engineers",
    engineerRoutes
);

app.use(
    "/api/operational-assignment",
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
    path.join(__dirname, "frontend", "dist");

app.use(
    express.static(distDir)
);

app.use((req, res, next) => {

    if (
        req.method !== "GET" ||
        req.path.startsWith("/api")
    ) {
        return next();
    }

    res.sendFile(

        path.join(
            distDir,
            "index.html"
        ),

        err => {

            if (err)
                next();

        }

    );

});

/* ==========================================================
   Start Server
========================================================== */

async function start() {

    await whatsapp.connect();

    app.listen(config.PORT, () => {

        console.log(
            `🚀 Server berjalan di port ${config.PORT}`
        );

    });

}

start().catch(err => {

    console.error(err);

});