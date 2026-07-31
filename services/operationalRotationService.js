const operationalRotationRepository =
    require("../repositories/operationalRotationRepository");

function mapRotation(rotation) {

    if (!rotation)
        return null;

    return {

        year: rotation.year,

        month: rotation.month,

        primaryTeam: rotation.primary_team,

        backupTeam: rotation.backup_team

    };

}

function getCurrentRotation() {

    return mapRotation(

        operationalRotationRepository.getCurrent()

    );

}

function getRotation(year, month) {

    return mapRotation(

        operationalRotationRepository.getByPeriod(
            year,
            month
        )

    );

}

function getAllRotation() {

    return operationalRotationRepository.getAll();

}

function getNextRotation() {

    return mapRotation(

        operationalRotationRepository.getNext()

    );

}

function getPreviousRotation() {

    return mapRotation(

        operationalRotationRepository.getPrevious()

    );

}

function updateRotation(
    year,
    month,
    primaryTeam,
    backupTeam,
    updatedBy
) {

    if (primaryTeam === backupTeam) {

        throw new Error(
            "Primary Team dan Backup Team tidak boleh sama."
        );

    }

    return operationalRotationRepository.update(

        year,

        month,

        primaryTeam,

        backupTeam,

        updatedBy,

        new Date().toISOString()

    );

}

function getPrimaryTeam() {

    const rotation = getCurrentRotation();

    return rotation
        ? rotation.primaryTeam
        : null;

}

function getBackupTeam() {

    const rotation = getCurrentRotation();

    return rotation
        ? rotation.backupTeam
        : null;

}

function isPrimaryTeam(team) {

    return getPrimaryTeam() === team;

}

module.exports = {

    getCurrentRotation,

    getRotation,

    getAllRotation,

    getNextRotation,

    getPreviousRotation,

    updateRotation,

    getPrimaryTeam,

    getBackupTeam,

    isPrimaryTeam

};