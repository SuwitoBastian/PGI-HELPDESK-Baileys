const assignmentRepository =
    require("../repositories/operationalAssignmentRepository");

const operationalRotationRepository =
    require("../repositories/operationalRotationRepository");

const db =
    require("../database/database");

/* ==========================================================
   Save Assignment
========================================================== */

function save(

    rotationId,

    akrCodes = []

) {

    if (!rotationId) {

        throw new Error(
            "Rotation tidak ditemukan."
        );

    }

    const transaction =
        db.transaction(() => {

            assignmentRepository.deleteByRotation(
                rotationId
            );

            akrCodes.forEach(code => {

                assignmentRepository.insert(

                    rotationId,

                    code

                );

            });

        });

    transaction();

    return {

        rotationId

    };

}

/* ==========================================================
   Get Assignment By Rotation
========================================================== */

function getAssignment(rotationId) {

    return {

        akr:
            assignmentRepository.getAKR(
                rotationId
            ),

        headOffice:
            assignmentRepository.getHeadOffice(
                rotationId
            )

    };

}

/* ==========================================================
   Get Current Assignment
========================================================== */

function getCurrentAssignment() {

    const current =
        operationalRotationRepository.getCurrent();

    if (!current) {

        return {

            akr: [],

            headOffice: []

        };

    }

    return getAssignment(
        current.id
    );

}

/* ==========================================================
   Export
========================================================== */

module.exports = {

    save,

    getAssignment,

    getCurrentAssignment

};