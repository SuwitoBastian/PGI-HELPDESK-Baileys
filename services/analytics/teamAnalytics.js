const engineerAnalytics =
    require("./engineerAnalytics");

const teamStatus =
    require("./teamStatus");


// ============================================================
// LOCATION LABEL
// ============================================================

function getLocationName(location) {

    if (location === "AKR") {

        return "HO - AKR Tower";

    }

    if (location === "HO") {

        return "Head Office";

    }

    return location || "-";

}


// ============================================================
// BUILD LOCATION GROUPS
// ============================================================
//
// Sistem baru menggunakan:
//
//     AKR -> HO - AKR Tower
//     HO  -> Head Office
//
// Tidak menggunakan TEAM_A / TEAM_B.
// ============================================================

function buildLocationGroups() {

    return {

        AKR: {

            id: "AKR",

            name: "HO - AKR Tower",

            engineers: []

        },

        HO: {

            id: "HO",

            name: "Head Office",

            engineers: []

        }

    };

}


// ============================================================
// FEEDBACK + BRANCH HANDLED
// ============================================================
//
// Digunakan baik untuk:
//
// 1. ALL PERFORMANCE
// 2. LOCATION PERFORMANCE
//
// Data dihitung berdasarkan engineer yang berada
// di lokasi tersebut.
//
// Tidak menggunakan TEAM_A / TEAM_B.
// ============================================================

function getLocationOperationalMetrics(
    group,
    location,
    start,
    end
) {

    let waitingFeedback = 0;

    let branchHandled = 0;


    const engineerNames =
        group.engineers
            .map(
                engineer =>
                    engineer.name
            )
            .filter(Boolean);


    if (
        engineerNames.length === 0
    ) {

        return {

            waitingFeedback: 0,

            branchHandled: 0

        };

    }


    try {

        const db =
            require(
                "../../database/database"
            );


        // =====================================================
        // WAITING FEEDBACK
        // =====================================================

        let feedbackSql = `

            SELECT COUNT(*) AS total

            FROM tickets

            WHERE status = 'CLOSED'

            AND pic_selesai IN (
                ${engineerNames
                    .map(() => "?")
                    .join(",")}
            )

            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))

        `;


        const feedbackParams = [

            ...engineerNames,

            location

        ];


        if (
            start &&
            end
        ) {

            feedbackSql += `

                AND DATE(selesai)
                    BETWEEN DATE(?)
                    AND DATE(?)

            `;


            feedbackParams.push(

                start,

                end

            );

        }


        waitingFeedback =
            db
                .prepare(
                    feedbackSql
                )
                .get(
                    ...feedbackParams
                )
                .total || 0;


        // =====================================================
        // BRANCH HANDLED
        // =====================================================

        let branchSql = `

            SELECT COUNT(
                DISTINCT cabang
            ) AS total

            FROM tickets

            WHERE status = 'CLOSED'

            AND pic_selesai IN (
                ${engineerNames
                    .map(() => "?")
                    .join(",")}
            )

            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))

            AND cabang IS NOT NULL

            AND cabang <> ''

        `;


        const branchParams = [

            ...engineerNames,

            location

        ];


        if (
            start &&
            end
        ) {

            branchSql += `

                AND DATE(selesai)
                    BETWEEN DATE(?)
                    AND DATE(?)

            `;


            branchParams.push(

                start,

                end

            );

        }


        branchHandled =
            db
                .prepare(
                    branchSql
                )
                .get(
                    ...branchParams
                )
                .total || 0;

    }

    catch (err) {

        console.error(
            "Location analytics error:",
            err
        );

    }


    return {

        waitingFeedback,

        branchHandled

    };

}


// ============================================================
// GET TEAMS / LOCATION PERFORMANCE
// ============================================================

function getTeams(
    start = null,
    end = null,
    teamFilter = null,
    location = null
) {


    /*
    ============================================================
    ENGINEER STATISTICS
    ============================================================
    */

    const engineerStats =
        engineerAnalytics.getEngineers(

            start,

            end,

            location
                ? null
                : teamFilter,

            location

        );


    /*
    ============================================================
    GROUP
    ============================================================
    */

    let groups;


    // =========================================================
    // LOCATION FILTER
    // =========================================================

    if (location) {

        groups = {

            [location]: {

                id: location,

                name:
                    getLocationName(
                        location
                    ),

                engineers: []

            }

        };

    }


    // =========================================================
    // ALL PERFORMANCE
    // =========================================================
    //
    // Group berdasarkan engineer.location.
    //
    // BUKAN engineer.team.
    // =========================================================

    else {

        groups =
            buildLocationGroups();

    }


    /*
    ============================================================
    GROUP ENGINEERS
    ============================================================
    */

    engineerStats.forEach(
        engineer => {


            let group;


            // =================================================
            // LOCATION FILTER
            // =================================================

            if (location) {

                group =
                    groups[location];

            }


            // =================================================
            // ALL PERFORMANCE
            // =================================================

            else {

                group =
                    groups[
                        engineer.location
                    ];

            }


            if (group) {

                group.engineers.push(
                    engineer
                );

            }

        }
    );


    /*
    ============================================================
    CALCULATE GROUP STATISTICS
    ============================================================
    */

    Object.values(groups).forEach(
        group => {


            // =================================================
            // ASSIGNED
            // =================================================

            group.assigned =
                group.engineers.reduce(

                    (sum, engineer) =>

                        sum +
                        engineer.assigned,

                    0

                );


            // =================================================
            // COMPLETED
            // =================================================

            group.completed =
                group.engineers.reduce(

                    (sum, engineer) =>

                        sum +
                        engineer.completed,

                    0

                );


            // =================================================
            // PROCESS
            // =================================================

            group.process =
                group.engineers.reduce(

                    (sum, engineer) =>

                        sum +
                        engineer.process,

                    0

                );


            // =================================================
            // COMPLETION RATE
            // =================================================

            let completionRate = 0;


            if (
                group.assigned > 0
            ) {

                completionRate =
                    Math.round(

                        (
                            group.completed /
                            group.assigned
                        ) * 100

                    );


                completionRate =
                    Math.min(
                        completionRate,
                        100
                    );

            }


            group.completionRate =
                completionRate;


            // =================================================
            // WORKLOAD
            // =================================================

            group.workload =
                group.process;


            // =================================================
            // OVERVIEW
            // =================================================

            const totalEngineer =
                group.engineers.length;


            const avgTicketPerEngineer =
                totalEngineer > 0

                    ? Number(

                        (
                            group.assigned /
                            totalEngineer

                        ).toFixed(1)

                    )

                    : 0;


            // =================================================
            // LOCATION OPERATIONAL METRICS
            // =================================================
            //
            // Untuk ALL maupun location filter,
            // group sekarang selalu berbasis lokasi.
            // =================================================

            const operationalMetrics =
                getLocationOperationalMetrics(

                    group,

                    group.id,

                    start,

                    end

                );


            const waitingFeedback =
                operationalMetrics
                    .waitingFeedback;


            const branchHandled =
                operationalMetrics
                    .branchHandled;


            // =================================================
            // OVERVIEW RESULT
            // =================================================

            group.overview = {

                totalEngineer,

                avgTicketPerEngineer,

                waitingFeedback,

                branchHandled

            };


            // =================================================
            // STATUS
            // =================================================

            const status =
                teamStatus.getStatus(

                    group.assigned,

                    group.completionRate

                );


            group.status =
                status.label;


            group.color =
                status.color;

        }
    );


    /*
    ============================================================
    RETURN
    ============================================================
    */

    return Object.values(
        groups
    );

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getTeams

};