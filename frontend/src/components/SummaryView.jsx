import OverviewPage from "./dashboard/overview/OverviewPage";
import AnalyticsPage from "./dashboard/analytics/AnalyticsPage";
import TrendPage from "./dashboard/trend/TrendPage";

export default function SummaryView({
    data,
    team = "ALL",
    page = "overview"
}) {

    switch (page) {

        case "analytics":
            return (
                <AnalyticsPage
                    data={data}
                    team={team}
                />
            );

        case "trend":
            return (
                <TrendPage
                    data={data}
                    team={team}
                />
            );

        default:
            return (
                <OverviewPage
                    data={data}
                />
            );

    }

}