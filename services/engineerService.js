const engineerRepository =
    require("../repositories/engineerRepository");

const operationalAssignmentService =
    require("./operationalAssignmentService");

/* ==========================================================
   Get All Engineers
========================================================== */

function getAll() {

    return engineerRepository.getAll();

}

/* ==========================================================
   Get Engineer By Code
========================================================== */

function getByCode(code) {

    return engineerRepository.getByCode(code);

}

/* ==========================================================
   Get Team
========================================================== */

function getByTeam(team) {

    return engineerRepository.getByTeam(team);

}

/* ==========================================================
   Create Engineer
========================================================== */

function create(code, name) {

    code = code.trim().toUpperCase();
    name = name.trim();

    if (!code) {

        throw new Error(
            "Kode Engineer wajib diisi."
        );

    }

    if (!name) {

        throw new Error(
            "Nama Engineer wajib diisi."
        );

    }

    const exists =
        engineerRepository.getByCode(code);

    if (exists) {

        throw new Error(
            "Kode Engineer sudah digunakan."
        );

    }

    engineerRepository.create(

        code,

        name

    );

}

/* ==========================================================
   Update Engineer
========================================================== */

function update(code, name) {

    code = code.trim().toUpperCase();
    name = name.trim();

    if (!name) {

        throw new Error(
            "Nama Engineer wajib diisi."
        );

    }

    const engineer =
        engineerRepository.getByCode(code);

    if (!engineer) {

        throw new Error(
            "Engineer tidak ditemukan."
        );

    }

    engineerRepository.update(

        code,

        name

    );

}

/* ==========================================================
   Export
========================================================== */

module.exports = {

    getAll,

    getByCode,

    getByTeam,

    create,

    update

};