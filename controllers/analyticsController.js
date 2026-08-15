const overviewAnalytics =
    require("../services/analytics/overviewAnalytics");

const engineerAnalytics =
    require("../services/analytics/engineerAnalytics");

const teamAnalytics =
    require("../services/analytics/teamAnalytics");


async function getAnalytics(req, res) {

    try {

        const {
            start,
            end,
            team,
            location
        } = req.query;

        /*
        ============================================================
        OVERVIEW

        Location mode:
            location=AKR
                ↓a
            engineer aktif di AKR
                ↓
            ticket berdasarkan engineer tersebut

        Jika location tidak ada,
        gunakan legacy TEAM_A / TEAM_B.
        ============================================================
        */

        const overview =
            await overviewAnalytics.getOverview(
                start,
                end,
                team,
                location
            );


        /*
        ============================================================
        ENGINEER ANALYTICS

        Sistem baru:

            location=AKR
                ↓
            operational_assignment
                ↓
            engineer aktual

        Jika location tidak ada, engineerAnalytics
        masih fallback ke TEAM_A / TEAM_B.
        ============================================================
        */

        const engineers =
            engineerAnalytics.getEngineers(
                start,
                end,
                team,
                location
            );


        /*
        ============================================================
        TEAM / LOCATION ANALYTICS

        Sistem baru:

            AKR → HO - AKR Tower
            HO  → Head Office

        ============================================================
        */

        const teams =
            teamAnalytics.getTeams(
                start,
                end,
                team,
                location
            );


        res.json({

            success: true,

            overview,

            engineers,

            teams

        });


    }

    catch (err) {

        console.error(err);


        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}


module.exports = {

    getAnalytics

};