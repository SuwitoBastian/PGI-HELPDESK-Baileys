const repository =
    require("../../repositories/ticketRepository");

const engineerService =
    require("../engineerService");

const dashboardLocationService =
    require("../dashboard/dashboardLocationService");

const metrics =
    require("./metrics");

const contributionCalculator =
    require("./calculators/contributionCalculator");

const capacityCalculator =
    require("./calculators/capacityCalculator");

const scoreCalculator =
    require("./calculators/scoreCalculator");


// ============================================================
// GET ALL ENGINEERS WITH CURRENT LOCATION
// ============================================================
//
// Sumber lokasi:
// operational assignment saat ini.
//
// AKR:
// engineer yang sedang berada di operational assignment AKR.
//
// HO:
// engineer lainnya.
//
// Tidak menggunakan TEAM_A / TEAM_B sebagai lokasi.
// ============================================================

function getAllEngineersWithLocation() {

    const engineers =
        engineerService.getAll();


    const akrEngineers =
        dashboardLocationService
            .getCurrentLocationEngineers("AKR");


    const akrCodes =
        new Set(

            akrEngineers.map(
                engineer =>
                    engineer.code
            )

        );


    return engineers.map(
        engineer => ({

            ...engineer,

            location:
                akrCodes.has(
                    engineer.code
                )
                    ? "AKR"
                    : "HO"

        })
    );

}


// ============================================================
// GET ENGINEERS
// ============================================================

function getEngineers(
    start = null,
    end = null,
    team = null,
    location = null
) {


    /*
    ============================================================
    LOCATION MODE
    ============================================================

    Jika location diberikan:

        AKR
        HO

    maka engineer diambil langsung dari
    operational assignment.

    Ini menjadi sumber utama sistem baru.
    ============================================================
    */

    let engineerList;


    if (location) {

        engineerList =
            dashboardLocationService
                .getCurrentLocationEngineers(
                    location
                );

    }


    /*
    ============================================================
    ALL MODE
    ============================================================

    Jika location tidak diberikan:

    Ambil seluruh engineer kemudian tentukan
    lokasi aktual berdasarkan operational assignment.

    BUKAN berdasarkan TEAM_A / TEAM_B.
    ============================================================
    */

    else {

        engineerList =
            getAllEngineersWithLocation();


        /*
        --------------------------------------------------------
        Legacy team filter
        --------------------------------------------------------

        Tetap dipertahankan untuk compatibility
        caller lama yang masih mengirim team.

        Tetapi lokasi tetap ditentukan berdasarkan
        operational assignment.
        --------------------------------------------------------
        */

        if (team) {

            engineerList =
                engineerList.filter(
                    engineer =>
                        engineer.team === team
                );

        }

    }


    /*
    ============================================================
    CALCULATE ENGINEER METRICS
    ============================================================
    */

    const data =
        engineerList.map(
            engineer => {


                /*
                ------------------------------------------------
                LOCATION MODE
                ------------------------------------------------

                Jangan kirim TEAM_A / TEAM_B
                ke repository.

                Jika location tersedia,
                repository menggunakan filter lokasi.
                ------------------------------------------------
                */

                const metricTeam =
                    location
                        ? null
                        : team;


                const metricLocation =
                    location
                        ? location
                        : null;


                /*
                ------------------------------------------------
                ASSIGNED
                ------------------------------------------------
                */

                const assigned =
                    metrics.assignment.build(

                        engineer,

                        repository,

                        start,

                        end,

                        metricTeam,

                        metricLocation

                    );


                /*
                ------------------------------------------------
                COMPLETED
                ------------------------------------------------
                */

                const completed =
                    metrics.completion.build(

                        engineer,

                        repository,

                        start,

                        end,

                        metricTeam,

                        metricLocation

                    );


                /*
                ------------------------------------------------
                PROCESS
                ------------------------------------------------
                */

                const process =
                    metrics.workload.build(

                        engineer,

                        repository,

                        start,

                        end,

                        metricTeam,

                        metricLocation

                    );


                return {

                    code:
                        engineer.code,

                    name:
                        engineer.name,


                    /*
                    ------------------------------------------------
                    LEGACY TEAM

                    Tetap disimpan untuk compatibility
                    internal / sistem lama.

                    Tidak digunakan sebagai lokasi UI.
                    ------------------------------------------------
                    */

                    team:
                        engineer.team,


                    /*
                    ------------------------------------------------
                    LOCATION

                    Sistem baru menggunakan:

                        AKR
                        HO

                    ------------------------------------------------
                    */

                    location:
                        engineer.location
                        || location
                        || null,


                    assigned,

                    completed,

                    process

                };

            }
        );


    /*
    ============================================================
    CONTRIBUTION / CAPACITY / SCORE
    ============================================================
    */

    const totalCompleted =
        data.reduce(

            (sum, engineer) =>
                sum + engineer.completed,

            0

        );


    data.forEach(
        engineer => {


            engineer.contribution =
                contributionCalculator.calculate(

                    engineer.completed,

                    totalCompleted

                );


            engineer.capacity =
                capacityCalculator.calculate(

                    engineer.process

                );


            engineer.score =
                scoreCalculator.calculate(

                    engineer

                );

        }
    );


    /*
    ============================================================
    SORT BY SCORE
    ============================================================
    */

    data.sort(

        (a, b) =>
            b.score - a.score

    );


    return data;

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getEngineers

};