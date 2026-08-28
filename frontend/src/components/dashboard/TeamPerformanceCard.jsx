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
// PERFORMANCE LABEL
// =====================================================

function getPerformanceLabel(status) {

    switch (status) {

        case "STANDBY":
            return "Siaga";

        case "EXCELLENT":
            return "Sangat Baik";

        case "GOOD":
            return "Baik";

        case "FAIR":
            return "Cukup";

        case "NEEDS ATTENTION":
            return "Perlu Perhatian";

        case "NO DATA":
            return "Tidak Ada Data";

        default:
            return status || "Tidak Ada Data";

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


    const performanceLabel =
        getPerformanceLabel(
            performance
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
                            performance
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                        }`
                    }
                >

                    <span className="status-dot"></span>

                    {performanceLabel}

                </span>

            </div>


            {/* =================================================
                COMPLETION
            ================================================= */}

            <div className="team-completion">

                <small>
                    Tingkat Penyelesaian
                </small>


                <strong>
                    {location?.completionRate ?? 0}%
                </strong>


                <span
                    className={
                        `team-performance ${performanceClass}`
                    }
                >

                    {performanceLabel}

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
                        Ditugaskan
                    </span>

                    <strong>
                        {location?.assigned ?? 0}
                    </strong>

                </div>


                {/* COMPLETED */}

                <div className="metric">

                    <span>
                        Selesai
                    </span>

                    <strong>
                        {location?.completed ?? 0}
                    </strong>

                </div>


                {/* PROCESS */}

                <div className="metric">

                    <span>
                        Dalam Proses
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
                        Performa Lokasi
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
                                    Tidak Ada Data
                                </h4>

                            </div>


                            <div className="team-metrics">

                                <div className="metric">

                                    <span>
                                        Lokasi
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
                                        Ringkasan Lokasi
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

                                RINGKASAN

                            </span>

                        </div>


                        <div className="team-metrics">


                            {/* TOTAL PIC */}

                            <div className="metric">

                                <span>
                                    Total PIC
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
                                    Rata-rata Tiket / PIC
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
                                    Menunggu Feedback
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
                                    Cabang Ditangani
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