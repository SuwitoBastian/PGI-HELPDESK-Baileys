const db = require("../database/database");

/* ==========================================================
   Get All Engineers
========================================================== */

function getAll() {

    return db.prepare(`
        SELECT *
        FROM engineers
        WHERE aktif = 1
        ORDER BY
            team ASC,
            name ASC
    `).all();

}

/* ==========================================================
   Get Engineer By Code
========================================================== */

function getByCode(code) {

    return db.prepare(`
        SELECT *
        FROM engineers
        WHERE code = ?
    `).get(code);

}

/* ==========================================================
   Get Engineers By Team
========================================================== */

function getByTeam(team) {

    return db.prepare(`
        SELECT *
        FROM engineers
        WHERE team = ?
          AND aktif = 1
        ORDER BY
            name ASC
    `).all(team);

}

/* ==========================================================
   Create Engineer
========================================================== */

function create(code, name) {

    return db.prepare(`
        INSERT INTO engineers
        (
            code,
            name,
            team,
            role,
            aktif
        )
        VALUES
        (
            ?,
            ?,
            'TEAM_B',
            'MEMBER',
            1
        )
    `).run(

        code,

        name

    );

}

/* ==========================================================
   Update Engineer
========================================================== */

function update(code, name) {

    return db.prepare(`
        UPDATE engineers
        SET
            name = ?
        WHERE
            code = ?
    `).run(

        name,

        code

    );

}

/* ==========================================================
   Update Team
========================================================== */

function updateTeams(primaryCodes = []) {

    const transaction = db.transaction(() => {

        db.prepare(`
            UPDATE engineers
            SET team = 'TEAM_B'
            WHERE aktif = 1
        `).run();

        const update = db.prepare(`
            UPDATE engineers
            SET team = 'TEAM_A'
            WHERE code = ?
        `);

        primaryCodes.forEach(code => {

            update.run(code);

        });

    });

    transaction();

}

/* ==========================================================
   Export
========================================================== */

module.exports = {

    getAll,

    getByCode,

    getByTeam,

    create,

    update,

    updateTeams

};