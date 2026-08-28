import TeamPerformanceCard from "../TeamPerformanceCard";
import EngineerLeaderboardCard from "../EngineerLeaderboardCard";
import TopBranchCard from "../TopBranchCard";
import SLAPerformanceCard from "../SLAPerformanceCard";
import StatusDistributionCard from "../StatusDistributionCard";
import CustomerFeedbackActivityCard from "../CustomerFeedbackActivityCard";


// =====================================================
// LOCATION LABEL
// =====================================================

function getLocationLabel(location) {

    switch (location) {

        case "AKR":
            return "HO - AKR Tower";

        case "HO":
            return "Head Office";

        default:
            return "Semua Performa";

    }

}


// =====================================================
// ANALYTICS PAGE
// =====================================================

export default function AnalyticsPage({

    data,

    team = "ALL",

    location = ""

}) {


    const locationLabel =
        getLocationLabel(
            location
        );


    return (

        <>

            {/* ==================================================
                LOCATION PERFORMANCE
            ================================================== */}

            <TeamPerformanceCard

                teams={
                    data?.analytics?.teams || []
                }

                team={team}

                location={location}

            />


            {/* ==================================================
                ENGINEER + TOP BRANCH
            ================================================== */}

            <div className="overview-row">


                {/* =================================================
                    ENGINEER LEADERBOARD
                ================================================= */}

                <div className="overview-col leaderboard-col">

                    <EngineerLeaderboardCard

                        engineers={
                            data?.analytics?.engineers || []
                        }

                        location={
                            location
                        }

                    />

                </div>


                {/* =================================================
                    TOP BRANCH
                ================================================= */}

                <div className="overview-col branch-col">

                    <TopBranchCard

                        topCabang={
                            data?.topCabang || []
                        }

                    />

                </div>

            </div>


            {/* ==================================================
                SLA + STATUS
            ================================================== */}

            <div className="overview-row">


                {/* =================================================
                    SLA
                ================================================= */}

                <SLAPerformanceCard

                    sla={
                        data?.analytics?.overview?.sla
                        || data?.sla
                    }

                    location={
                        location
                    }

                />


                {/* =================================================
                    STATUS DISTRIBUTION
                ================================================= */}

                <StatusDistributionCard

                    data={
                        data
                    }

                />

            </div>


            {/* ==================================================
                CUSTOMER FEEDBACK
            ================================================== */}

            {!location && (
                <div className="feedback-row">

                    <CustomerFeedbackActivityCard

                        feedback={
                            data?.feedback || []
                        }

                        statistics={
                            data?.feedbackStatistics || {}
                        }

                    />

                </div>
            )}
        </>

    );

}