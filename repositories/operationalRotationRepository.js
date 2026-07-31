const db = require("../database/database");

function getCurrent() {

    const now = new Date();

    return getByPeriod(
        now.getFullYear(),
        now.getMonth() + 1
    );

}

function getByPeriod(year, month) {

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

function getAll() {

    return db.prepare(`
        SELECT *
        FROM operational_rotation
        ORDER BY year DESC, month DESC
    `).all();

}

function getNext() {

    const now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth() + 2;

    if (month > 12) {

        month = 1;
        year++;

    }

    return getByPeriod(
        year,
        month
    );

}

function getPrevious() {

    const now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth();

    if (month === 0) {

        month = 12;
        year--;

    }

    return getByPeriod(
        year,
        month
    );

}

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

module.exports = {

    getCurrent,

    getByPeriod,

    getAll,

    getNext,

    getPrevious,

    update

};