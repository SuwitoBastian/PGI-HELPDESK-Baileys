const db =
    require("../database/database");

/* ==========================================================
   Get Assignment By Rotation
========================================================== */

function getByRotation(rotationId) {

    return db.prepare(`
        SELECT
            oa.*,
            e.code,
            e.name,
            e.whatsapp,
            e.role
        FROM operational_assignment oa
        JOIN engineers e
            ON e.code = oa.engineer_code
        WHERE oa.rotation_id = ?
        ORDER BY
            e.name ASC
    `).all(rotationId);

}

/* ==========================================================
   Get Current AKR
========================================================== */

function getAKR(rotationId) {

    return db.prepare(`
        SELECT
            e.*
        FROM operational_assignment oa
        JOIN engineers e
            ON e.code = oa.engineer_code
        WHERE oa.rotation_id = ?
        ORDER BY
            e.name ASC
    `).all(rotationId);

}

/* ==========================================================
   Get Current Head Office
========================================================== */

function getHeadOffice (rotationId) {

    return db.prepare(`
        SELECT *
        FROM engineers
        WHERE aktif = 1
        AND code NOT IN (

            SELECT engineer_code
            FROM operational_assignment
            WHERE rotation_id = ?

        )
        ORDER BY
            name ASC
    `).all(rotationId);

}

/* ==========================================================
   Delete Assignment
========================================================== */

function deleteByRotation(rotationId) {

    return db.prepare(`
        DELETE
        FROM operational_assignment
        WHERE rotation_id = ?
    `).run(rotationId);

}

/* ==========================================================
   Insert Assignment
========================================================== */

const insertStatement =
    db.prepare(`
        INSERT INTO operational_assignment
        (
            rotation_id,
            engineer_code
        )
        VALUES
        (
            ?, ?
        )
    `);

function insert(
    rotationId,
    engineerCode
) {

    return insertStatement.run(

        rotationId,

        engineerCode

    );

}

/* ==========================================================
   Export
========================================================== */

module.exports = {

    getByRotation,

    getAKR,

    getHeadOffice,

    deleteByRotation,

    insert

};