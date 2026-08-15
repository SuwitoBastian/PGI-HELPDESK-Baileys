import {
    Building2,
    MapPin
} from "lucide-react";


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
            return location || "-";

    }

}


// =====================================================
// PERFORMANCE CLASS
// =====================================================

function getPerformanceClass(status) {

    switch (status) {

        case "STANDBY":
            return "excellent";

        case "EXCELLENT":
            return "excellent";

        case "GOOD":
            return "healthy";

        case "FAIR":
            return "warning";

        case "NEEDS ATTENTION":
            return "attention";

        default:
            return "attention";

    }

}


// =====================================================
// LOCATION CARD
// =====================================================

function LocationCard({
    location
}) {

    const performance =
        location?.status || "NO DATA";


    const performanceClass =
        getPerformanceClass(
            location?.status
        );


    return (

        <div
            className="team-card"
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="location-card-header">

                <div className="location-card-identity">

                    <div className="location-icon">

                        <Building2
                            size={21}
                            strokeWidth={2}
                        />

                    </div>


                    <div className="location-card-title">

                        <h4>
                            {getLocationLabel(
                                location?.id
                            )}
                        </h4>


                        <div className="location-card-subtitle">

                            <MapPin
                                size={14}
                                strokeWidth={2}
                            />

                            <span>
                                {location?.id || "-"}
                            </span>

                        </div>

                    </div>

                </div>


                <span
                    className={
                        `team-status ${
                            location?.status?.toLowerCase()
                                .replace(/\s+/g, "-") || ""
                        }`
                    }
                >

                    <span className="status-dot"></span>

                    {performance}

                </span>

            </div>

            {/* =================================================
                COMPLETION
            ================================================= */}

            <div className="team-completion">

                <small>
                    Completion Rate
                </small>


                <strong>
                    {location?.completionRate ?? 0}%
                </strong>


                <span
                    className={
                        `team-performance ${performanceClass}`
                    }
                >
                    {performance}
                </span>

            </div>


            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="team-progress">

                <div className="progress">

                    <div
                        className={
                            `progress-fill ${performanceClass}`
                        }
                        style={{
                            width:
                                `${Math.min(
                                    Number(
                                        location?.completionRate
                                    ) || 0,
                                    100
                                )}%`
                        }}
                    />

                </div>

            </div>


            {/* =================================================
                METRICS
            ================================================= */}

            <div className="team-metrics">


                {/* ASSIGNED */}

                <div className="metric">

                    <span>
                        Assigned
                    </span>

                    <strong>
                        {location?.assigned ?? 0}
                    </strong>

                </div>


                {/* COMPLETED */}

                <div className="metric">

                    <span>
                        Completed
                    </span>

                    <strong>
                        {location?.completed ?? 0}
                    </strong>

                </div>


                {/* PROCESS */}

                <div className="metric">

                    <span>
                        Process
                    </span>

                    <strong>
                        {location?.process ?? 0}
                    </strong>

                </div>

            </div>

        </div>

    );

}


// =====================================================
// COMPONENT
// =====================================================

export default function TeamPerformanceCard({

    teams = [],
    location = ""

}) {

console.log(
    "TEAM PERFORMANCE DEBUG:",
    {
        count: teams.length,
        ids: teams.map(t => t.id),
        names: teams.map(t => t.name)
    }
);

    return (

        <div
            className={`card team-performance-card ${
                location ? "location-mode" : ""
            }`}
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="card-header">

                <div className="card-title">

                    <Building2
                        size={20}
                        strokeWidth={2}
                    />

                    <span>
                        Location Performance
                    </span>

                </div>


                <p className="card-description">

                    Ringkasan performa dan beban kerja
                    setiap lokasi.

                </p>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="card-content">

                <div className="team-grid">


                    {teams.length > 0 ? (

                        teams.map(
                            location => (

                                <LocationCard
                                    key={
                                        location.id
                                    }
                                    location={
                                        location
                                    }
                                />

                            )
                        )

                    ) : (

                        <div className="team-card">

                            <div className="team-top">

                                <h4>
                                    No Data
                                </h4>

                            </div>

                            <div className="team-metrics">

                                <div className="metric">

                                    <span>
                                        Location
                                    </span>

                                    <strong>
                                        -
                                    </strong>

                                </div>

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    LOCATION OVERVIEW
                ================================================= */}

                {teams.length === 1 && (

                    <div className="team-card location-overview-card">

                        {/* =================================================
                            LOCATION OVERVIEW HEADER
                        ================================================= */}

                        <div className="location-overview-header">

                            <div className="location-card-identity">

                                <div className="overview-icon">

                                    <Building2
                                        size={21}
                                        strokeWidth={2}
                                    />

                                </div>


                                <div className="location-card-title">

                                    <h4>
                                        Location Overview
                                    </h4>


                                    <div className="location-card-subtitle">

                                        <MapPin
                                            size={14}
                                            strokeWidth={2}
                                        />

                                        <span>
                                            {
                                                getLocationLabel(
                                                    teams[0]?.id
                                                )
                                            }
                                        </span>

                                    </div>

                                </div>

                            </div>


                            <span className="overview-type-badge">

                                <span className="overview-badge-dot" />

                                OVERVIEW

                            </span>

                        </div>

                        <div className="team-metrics">


                            {/* TOTAL ENGINEER */}

                            <div className="metric">

                                <span>
                                    Total Engineer
                                </span>

                                <strong>

                                    {
                                        teams[0]
                                            ?.overview
                                            ?.totalEngineer
                                        ?? 0
                                    }

                                </strong>

                            </div>


                            {/* AVG TICKET */}

                            <div className="metric">

                                <span>
                                    Avg Ticket / Engineer
                                </span>

                                <strong>

                                    {
                                        teams[0]
                                            ?.overview
                                            ?.avgTicketPerEngineer
                                        ?? 0
                                    }

                                </strong>

                            </div>


                            {/* WAITING FEEDBACK */}

                            <div className="metric">

                                <span>
                                    Waiting Feedback
                                </span>

                                <strong>

                                    {
                                        teams[0]
                                            ?.overview
                                            ?.waitingFeedback
                                        ?? 0
                                    }

                                </strong>

                            </div>


                            {/* BRANCH HANDLED */}

                            <div className="metric">

                                <span>
                                    Branch Handled
                                </span>

                                <strong>

                                    {
                                        teams[0]
                                            ?.overview
                                            ?.branchHandled
                                        ?? 0
                                    }

                                </strong>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}