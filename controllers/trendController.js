const trendAnalytics =
    require("../services/analytics/trendAnalytics");


function getDailyTrend(req, res) {

    try {

        const {

            startDate,

            endDate,

            days,

            location

        } = req.query;


        const data =
            trendAnalytics.getDailyTrend({

                startDate,

                endDate,

                days:
                    days
                        ? Number(days)
                        : null,

                location

            });


        res.json(data);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

}


module.exports = {

    getDailyTrend

};