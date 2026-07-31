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

            team

        } = req.query;

        const overview =
            await overviewAnalytics.getOverview(
                start,
                end,
                team
            );

        const engineers =
            engineerAnalytics.getEngineers(
                start,
                end,
                team
            );

        const teams =
            teamAnalytics.getTeams(
                start,
                end,
                team
            );

        res.json({

            success: true,

            overview,

            engineers,

            teams

        });

    } catch (err) {

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