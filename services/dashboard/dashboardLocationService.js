const operationalRotationRepository =
    require("../../repositories/operationalRotationRepository");

const operationalAssignmentRepository =
    require("../../repositories/operationalAssignmentRepository");

const engineerRepository =
    require("../../repositories/engineerRepository");

/* ==========================================================
Get Current Location Engineers
========================================================== */

function getCurrentLocationEngineers(location) {

    const current =
        operationalRotationRepository.getCurrent();

    if (!current) {

        return [];

    }

    const allEngineers =
        engineerRepository.getAll();

    const akrEngineers =
        operationalAssignmentRepository.getAKR(
            current.id
        );

    const akrCodes =
        new Set(

            akrEngineers.map(
                engineer => engineer.code
            )

        );

    const normalizedLocation =
        String(location || "")
            .trim()
            .toUpperCase();

    /* ======================================================
       HO - AKR TOWER
    ====================================================== */

    if (
        normalizedLocation === "AKR" ||
        normalizedLocation === "HO-AKR" ||
        normalizedLocation === "HO_AKR"
    ) {

        return akrEngineers;

    }

    /* ======================================================
       HEAD OFFICE
    ====================================================== */

    if (
        normalizedLocation === "HO" ||
        normalizedLocation === "HEAD_OFFICE"
    ) {

        return allEngineers.filter(

            engineer =>
                !akrCodes.has(
                    engineer.code
                )

        );

    }

    return [];

}

/* ==========================================================
Get Current Location Engineer Names
========================================================== */

function getCurrentLocationNames(location) {

    return getCurrentLocationEngineers(
        location
    )
        .map(
            engineer => engineer.name
        )
        .filter(Boolean);

}

/* ==========================================================
Export
========================================================== */

module.exports = {

    getCurrentLocationEngineers,

    getCurrentLocationNames

};