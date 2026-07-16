const express = require('express');

const path = require('path');

const app = express();

const config = require('./config');

const exportRoutes =
    require("./routes/exportRoutes");

const migrate =
    require('./database/migrate');

migrate();

const whatsapp =
    require("./services/whatsapp");

const dashboardRoute =
    require("./routes/dashboardRoute");

const apiRoute =
    require("./routes/apiRoute");

app.set(
    "view engine",
    "ejs"
);

app.use(express.json());

app.use(
    express.static("public")
);

// API JSON untuk dashboard React
app.use(
    "/api",
    apiRoute
);

app.use(
    "/api/export",
    exportRoutes
);

// Dashboard EJS lama tetap tersedia sebagai backup di /legacy
app.use(
    "/legacy",
    dashboardRoute
);

// Sajikan hasil build React (frontend/dist) sebagai dashboard utama
const distDir = path.join(__dirname, "frontend", "dist");

app.use(express.static(distDir));

// Fallback SPA: request GET non-API/non-asset -> index.html React
app.use((req, res, next) => {

    if (req.method !== "GET" || req.path.startsWith("/api")) {
        return next();
    }

    res.sendFile(path.join(distDir, "index.html"), (err) => {
        if (err) {
            next();
        }
    });

});

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