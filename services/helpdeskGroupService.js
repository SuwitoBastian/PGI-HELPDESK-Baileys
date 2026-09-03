const helpdeskGroupRepository =
    require("../repositories/helpdeskGroupRepository");

/* ==========================================================
   Mapper
========================================================== */

function mapGroup(group) {

    if (!group)
        return null;

    return {

        id: group.id,

        groupName: group.group_name,

        groupId: group.group_id,

        enabled: Boolean(group.enabled),

        createdAt: group.created_at,

        updatedAt: group.updated_at

    };

}

/* ==========================================================
   Get All
========================================================== */

function getAll() {

    return helpdeskGroupRepository
        .getAll()
        .map(mapGroup);

}

/* ==========================================================
   Get By ID
========================================================== */

function getById(id) {

    return mapGroup(

        helpdeskGroupRepository.getById(id)

    );

}

/* ==========================================================
   Get Enabled Groups
========================================================== */

function getEnabled() {

    return helpdeskGroupRepository
        .getEnabled()
        .map(mapGroup);

}

/* ==========================================================
   Toggle
========================================================== */

function toggle(id) {

    const group =
        helpdeskGroupRepository.getById(id);

    if (!group) {

        throw new Error(
            "Grup Helpdesk tidak ditemukan."
        );

    }

    const newEnabled =
        group.enabled ? 0 : 1;

    helpdeskGroupRepository.toggle(

        id,

        newEnabled,

        new Date().toISOString()

    );

    return mapGroup(

        helpdeskGroupRepository.getById(id)

    );

}

/* ==========================================================
   Get By Group ID
========================================================== */

function getByGroupId(groupId) {

    return mapGroup(

        helpdeskGroupRepository
            .getByGroupId(groupId)

    );

}

/* ==========================================================
   Export
========================================================== */

module.exports = {

    getAll,

    getById,

    getEnabled,

    getByGroupId,

    toggle

};