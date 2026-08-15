const db = require("../database/database");

/* ==========================================================
   Current Date Helper
   ----------------------------------------------------------
   Normal:
   - menggunakan tanggal sistem

   Testing:
   - jika SIMULATE_DATE di .env tersedia,
     sistem akan menggunakan tanggal tersebut
========================================================== */

function getNow() {

    const simulatedDate =
        process.env.SIMULATE_DATE;

    if (simulatedDate) {

        const date =
            new Date(`${simulatedDate}T12:00:00`);

        if (!Number.isNaN(date.getTime())) {

            return date;

        }

        console.warn(
            `SIMULATE_DATE tidak valid: ${simulatedDate}`
        );

    }

    return new Date();

}

/* ==========================================================
   Current Rotation
========================================================== */

function getCurrent() {

    const now =
        getNow();

    return getByPeriod(

        now.getFullYear(),

        now.getMonth() + 1

    );

}

/* ==========================================================
   Get By Period
========================================================== */

function getByPeriod(
    year,
    month
) {

    return db.prepare(`
        SELECT *
        FROM operational_rotation
        WHERE year = ?
        AND month = ?
    `).get(

        year,

        month

    );

}

/* ==========================================================
   Get All
========================================================== */

function getAll() {

    return db.prepare(`
        SELECT *
        FROM operational_rotation
        ORDER BY year DESC, month DESC
    `).all();

}

/* ==========================================================
   Next Rotation
========================================================== */

function getNext() {

    const now =
        getNow();

    let year =
        now.getFullYear();

    let month =
        now.getMonth() + 2;

    if (month > 12) {

        month = 1;

        year++;

    }

    return getByPeriod(

        year,

        month

    );

}

/* ==========================================================
   Previous Rotation
========================================================== */

function getPrevious() {

    const now =
        getNow();

    let year =
        now.getFullYear();

    let month =
        now.getMonth();

    if (month === 0) {

        month = 12;

        year--;

    }

    return getByPeriod(

        year,

        month

    );

}

/* ==========================================================
   Update Rotation
========================================================== */

function update(
    year,
    month,
    primaryTeam,
    backupTeam,
    updatedBy,
    updatedAt
) {

    return db.prepare(`
        UPDATE operational_rotation
        SET

            primary_team = ?,

            backup_team = ?,

            updated_by = ?,

            updated_at = ?

        WHERE

            year = ?

            AND month = ?

    `).run(

        primaryTeam,

        backupTeam,

        updatedBy,

        updatedAt,

        year,

        month

    );

}

/* ==========================================================
   Export
========================================================== */

module.exports = {

    getCurrent,

    getByPeriod,

    getAll,

    getNext,

    getPrevious,

    update

};