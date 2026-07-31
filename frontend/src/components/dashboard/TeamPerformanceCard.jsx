import {
    Users
} from "lucide-react";

export default function TeamPerformanceCard({
    teams = [],
    team = "ALL"
}) {

    const isAll = team === "ALL";
    const selectedTeam =
    team === "ALL"
        ? teams[0]
        : teams.find(t => t.id === team);

    let selectedPerformance = selectedTeam?.status || "ATTENTION";
    let selectedPerformanceClass = "attention";

    switch (selectedTeam?.status) {

        case "STANDBY":
            selectedPerformanceClass = "excellent";
            break;

        case "EXCELLENT":
            selectedPerformanceClass = "excellent";
            break;

        case "GOOD":
            selectedPerformanceClass = "healthy";
            break;

        case "FAIR":
            selectedPerformanceClass = "warning";
            break;

        default:
            selectedPerformanceClass = "attention";
            break;

    }

    return (

        <div className="card team-performance-card">

            <div className="card-header">

                <div className="card-title">

                    <Users size={20} />

                    <span>Team Performance</span>

                </div>

                <p className="card-description">

                    Ringkasan performa dan beban kerja setiap team.

                </p>

            </div>

            <div className="card-content">

                <div className="team-grid">

                    {isAll ? (

                    teams.map(team => {

                        /* ==========================
                           Completion Insight
                        ========================== */

                        let performance = team.status;
                        let performanceClass = "attention";

                        switch (team.status) {

                            case "STANDBY":
                                performanceClass = "excellent";
                                break;

                            case "EXCELLENT":
                                performanceClass = "excellent";
                                break;

                            case "GOOD":
                                performanceClass = "healthy";
                                break;

                            case "FAIR":
                                performanceClass = "warning";
                                break;

                            default:
                                performanceClass = "attention";
                                break;

                        }

                        return (

                            <div
                                key={team.id}
                                className="team-card"
                            >

                                <div className="team-top">

                                    <h4>

                                        {team.name}

                                    </h4>

                                    <span
                                        className={`team-status ${team.status.toLowerCase()}`}
                                    >

                                        <span className="status-dot"></span>

                                        {team.status}

                                    </span>

                                </div>

                                <div className="team-completion">

                                    <small>

                                        Completion Rate

                                    </small>

                                    <strong>

                                        {team.completionRate}%

                                    </strong>

                                    <span
                                        className={`team-performance ${performanceClass}`}
                                    >

                                        {performance}

                                    </span>

                                </div>

                                <div className="team-progress">

                                    <div className="progress">

                                        <div
                                            className={`progress-fill ${performanceClass}`}
                                            style={{
                                                width: `${team.completionRate}%`
                                            }}
                                        />

                                    </div>

                                </div>

                                <div className="team-metrics">

                                    <div className="metric">

                                        <span>

                                            Assigned

                                        </span>

                                        <strong>

                                            {team.assigned}

                                        </strong>

                                    </div>

                                    <div className="metric">

                                        <span>

                                            Completed

                                        </span>

                                        <strong>

                                            {team.completed}

                                        </strong>

                                    </div>

                                    <div className="metric">

                                        <span>

                                            Process

                                        </span>

                                        <strong>

                                            {team.process}

                                        </strong>

                                    </div>

                                </div>

                            </div>

                        );

                                        })

                ) : (

                    <>

                        <div className="team-card">

                            <div className="team-top">

                                <h4>

                                    {selectedTeam?.name}

                                </h4>

                                <span
                                    className={`team-status ${selectedTeam?.status?.toLowerCase()}`}
                                >

                                    <span className="status-dot"></span>

                                    {selectedTeam?.status}

                                </span>

                            </div>

                            <div className="team-completion">

                                <small>

                                    Completion Rate

                                </small>

                                <strong>

                                    {selectedTeam?.completionRate}%

                                </strong>

                                <span
                                    className={`team-performance ${selectedPerformanceClass}`}
                                >

                                    {selectedTeam?.status}

                                </span>

                            </div>

                            <div className="team-progress">

                                <div className="progress">

                                    <div
                                        className={`progress-fill ${selectedPerformanceClass}`}
                                        style={{
                                            width: `${selectedTeam?.completionRate || 0}%`
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="team-metrics">

                                <div className="metric">

                                    <span>

                                        Assigned

                                    </span>

                                    <strong>

                                        {selectedTeam?.assigned}

                                    </strong>

                                </div>

                                <div className="metric">

                                    <span>

                                        Completed

                                    </span>

                                    <strong>

                                        {selectedTeam?.completed}

                                    </strong>

                                </div>

                                <div className="metric">

                                    <span>

                                        Process

                                    </span>

                                    <strong>

                                        {selectedTeam?.process}

                                    </strong>

                                </div>

                            </div>

                        </div>

                        <div className="team-card">

                            <div className="team-top">

                                <h4>

                                    Team Overview

                                </h4>

                            </div>

                            <div className="team-metrics">

                                <div className="metric">

                                    <span>

                                        Total Engineer

                                    </span>

                                    <strong>

                                        {selectedTeam?.overview?.totalEngineer ?? 0}

                                    </strong>

                                </div>

                                <div className="metric">

                                    <span>

                                        Avg Ticket / Engineer

                                    </span>

                                    <strong>

                                        {selectedTeam?.overview?.avgTicketPerEngineer ?? 0}

                                    </strong>

                                </div>

                                <div className="metric">

                                    <span>

                                        Waiting Feedback

                                    </span>

                                    <strong>

                                        {selectedTeam?.overview?.waitingFeedback ?? 0}

                                    </strong>

                                </div>

                                <div className="metric">

                                    <span>

                                        Branch Handled

                                    </span>

                                    <strong>

                                        {selectedTeam?.overview?.branchHandled ?? 0}

                                    </strong>

                                </div>

                            </div>

                        </div>

                    </>

                )}

                </div>

            </div>

        </div>

    );

}