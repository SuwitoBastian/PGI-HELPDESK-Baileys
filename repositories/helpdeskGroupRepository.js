const db =
    require("../database/database");

/* ==========================================================
   Get All Groups
========================================================== */

function getAll() {

    return db.prepare(`
        SELECT
            id,
            group_name,
            group_id,
            enabled,
            created_at,
            updated_at
        FROM helpdesk_groups
        ORDER BY id ASC
    `).all();

}

/* ==========================================================
   Get By ID
========================================================== */

function getById(id) {

    return db.prepare(`
        SELECT
            id,
            group_name,
            group_id,
            enabled,
            created_at,
            updated_at
        FROM helpdesk_groups
        WHERE id = ?
    `).get(id);

}

/* ==========================================================
   Get By Group ID
========================================================== */

function getByGroupId(groupId) {

    return db.prepare(`
        SELECT
            id,
            group_name,
            group_id,
            enabled
        FROM helpdesk_groups
        WHERE group_id = ?
    `).get(groupId);

}

/* ==========================================================
   Get Enabled Groups
========================================================== */

function getEnabled() {

    return db.prepare(`
        SELECT
            id,
            group_name,
            group_id,
            enabled
        FROM helpdesk_groups
        WHERE enabled = 1
        ORDER BY id ASC
    `).all();

}

/* ==========================================================
   Toggle Group
========================================================== */

function toggle(id, enabled, updatedAt) {

    return db.prepare(`
        UPDATE helpdesk_groups
        SET
            enabled = ?,
            updated_at = ?
        WHERE id = ?
    `).run(
        enabled,
        updatedAt,
        id
    );

}

/* ==========================================================
   Export
========================================================== */

module.exports = {

    getAll,

    getById,

    getByGroupId,

    getEnabled,

    toggle

};