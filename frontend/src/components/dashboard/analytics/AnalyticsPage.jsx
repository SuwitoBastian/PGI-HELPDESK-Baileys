import TeamPerformanceCard from "../TeamPerformanceCard";
import EngineerLeaderboardCard from "../EngineerLeaderboardCard";
import TopBranchCard from "../TopBranchCard";
import SLAPerformanceCard from "../SLAPerformanceCard";
import StatusDistributionCard from "../StatusDistributionCard";
import CustomerFeedbackActivityCard from "../CustomerFeedbackActivityCard";

export default function AnalyticsPage({

    data,

    team = "ALL"

}) {

    return (

        <>

            <TeamPerformanceCard
                teams={data.analytics?.teams || []}
                team={team}
            />

            <div className="overview-row">

                <div className="overview-col leaderboard-col">

                    <EngineerLeaderboardCard
                        engineers={data.analytics?.engineers || []}
                    />

                </div>

                <div className="overview-col branch-col">

                    <TopBranchCard
                        topCabang={data.topCabang || []}
                    />

                </div>

            </div>

            <div className="overview-row">

                <SLAPerformanceCard
                    sla={data.sla}
                />

                <StatusDistributionCard
                    data={data}
                />

            </div>

            <div className="feedback-row">

                <CustomerFeedbackActivityCard
                    feedback={data.feedback || []}
                    statistics={data.feedbackStatistics || {}}
                />

            </div>

        </>

    );

}