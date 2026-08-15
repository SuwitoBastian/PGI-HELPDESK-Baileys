import OverviewPage from "./dashboard/overview/OverviewPage";
import AnalyticsPage from "./dashboard/analytics/AnalyticsPage";
import TrendPage from "./dashboard/trend/TrendPage";

export default function SummaryView({
    data,
    team = "ALL",
    location = "",
    page
}) {

    switch (page) {

        case "analytics":
            return (
                <AnalyticsPage
                    data={data}
                    team={team}
                    location={location}
                />
            );

        case "trend":
            return (
                <TrendPage
                    data={data}
                    team={team}
                    location={location}
                />
            );

        default:
            return (
                <OverviewPage
                    data={data}
                    location={location}
                />
            );

    }

}