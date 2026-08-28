import {
    Clock3,
    TimerReset,
    Timer,
    ShieldCheck,
    ShieldAlert
} from "lucide-react";


// =====================================================
// HELPERS
// =====================================================

function formatMinutes(value, hasData) {

    if (!hasData) {
        return "—";
    }

    return `${value} menit`;
}


// =====================================================
// RESPONSE STATUS
// =====================================================

function getResponseStatus(minutes, hasData) {

    if (!hasData) {
        return {
            text: "Tidak Ada Data",
            className: "neutral"
        };
    }

    if (minutes <= 5) {
        return {
            text: "Sangat Baik",
            className: "excellent"
        };
    }

    if (minutes <= 10) {
        return {
            text: "Baik",
            className: "good"
        };
    }

    return {
        text: "Lambat",
        className: "warning"
    };
}


// =====================================================
// RESOLUTION STATUS
// =====================================================

function getResolutionStatus(minutes, hasData) {

    if (!hasData) {
        return {
            text: "Tidak Ada Data",
            className: "neutral"
        };
    }

    if (minutes <= 30) {
        return {
            text: "Baik",
            className: "excellent"
        };
    }

    if (minutes <= 60) {
        return {
            text: "Rata-rata",
            className: "good"
        };
    }

    return {
        text: "Melewati SLA",
        className: "warning"
    };
}


// =====================================================
// COMPONENT
// =====================================================

export default function SLAPerformanceCard({
    sla
}) {

    if (!sla) {
        return null;
    }


    // =================================================
    // RAW VALUES
    // =================================================

    const totalTicket =
        Number(sla.totalTicket) || 0;

    const averageResponseTime =
        Number(sla.averageResponseTime) || 0;

    const averageResolutionTime =
        Number(sla.averageResolutionTime) || 0;

    const averageTotalDuration =
        Number(sla.averageTotalDuration) || 0;

    const normalSLA =
        Number(sla.normalSLA) || 0;

    const expiredSLA =
        Number(sla.expiredSLA) || 0;


    // =================================================
    // SLA DATA
    //
    // Hanya tiket yang sudah memiliki hasil SLA
    // yang dianggap sebagai data SLA valid.
    // =================================================

    const slaEvaluatedTicket =
        normalSLA + expiredSLA;


    const hasSLAData =
        slaEvaluatedTicket > 0;


    // =================================================
    // STATUS
    // =================================================

    const response =
        getResponseStatus(
            averageResponseTime,
            hasSLAData
        );


    const resolution =
        getResolutionStatus(
            averageResolutionTime,
            hasSLAData
        );


    // =================================================
    // SUCCESS RATE
    //
    // Jangan gunakan totalTicket karena OPEN / PROCESS
    // belum tentu sudah mempunyai hasil SLA.
    // =================================================

    const successRate =
        hasSLAData
            ? Math.round(
                (normalSLA / slaEvaluatedTicket) * 100
            )
            : 0;


    return (

        <div className="card sla-performance-card">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="card-header">

                <h3 className="card-title">

                    Performa SLA

                </h3>


                <p className="card-description">

                    Rata-rata performa penyelesaian tiket.

                </p>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="card-content">


                {/* =================================================
                    SLA METRICS
                ================================================= */}

                <div className="sla-list">


                    {/* =================================================
                        RESPONSE
                    ================================================= */}

                    <div className="sla-row">

                        <div className="sla-left">

                            <Clock3 size={18} />

                            <div>

                                <span>
                                    Rata-rata Respons
                                </span>

                                <strong>

                                    {formatMinutes(
                                        averageResponseTime,
                                        hasSLAData
                                    )}

                                </strong>

                            </div>

                        </div>


                        <span
                            className={`sla-badge ${response.className}`}
                        >

                            {response.text}

                        </span>

                    </div>


                    {/* =================================================
                        RESOLUTION
                    ================================================= */}

                    <div className="sla-row">

                        <div className="sla-left">

                            <TimerReset size={18} />

                            <div>

                                <span>
                                    Rata-rata Penyelesaian
                                </span>

                                <strong>

                                    {formatMinutes(
                                        averageResolutionTime,
                                        hasSLAData
                                    )}

                                </strong>

                            </div>

                        </div>


                        <span
                            className={`sla-badge ${resolution.className}`}
                        >

                            {resolution.text}

                        </span>

                    </div>


                    {/* =================================================
                        TOTAL DURATION
                    ================================================= */}

                    <div className="sla-row">

                        <div className="sla-left">

                            <Timer size={18} />

                            <div>

                                <span>
                                    Total Durasi
                                </span>

                                <strong>

                                    {formatMinutes(
                                        averageTotalDuration,
                                        hasSLAData
                                    )}

                                </strong>

                            </div>

                        </div>


                        <span className="sla-badge neutral">

                            OPEN → CLOSED

                        </span>

                    </div>

                </div>


                {/* =================================================
                    SUCCESS RATE
                ================================================= */}

                <div className="sla-progress">

                    <div className="sla-progress-header">

                        <span>
                            Tingkat Keberhasilan SLA
                        </span>


                        <strong>

                            {hasSLAData
                                ? `${successRate}%`
                                : "—"
                            }

                        </strong>

                    </div>


                    <div className="sla-progress-bar">

                        <div
                            className="sla-progress-fill"
                            style={{
                                width: `${hasSLAData
                                    ? successRate
                                    : 0
                                }%`
                            }}
                        />

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="sla-footer">


                    {/* =================================================
                        NORMAL
                    ================================================= */}

                    <div className="sla-status normal">

                        <ShieldCheck size={18} />

                        <div>

                            <strong>

                                {normalSLA}

                            </strong>

                            <span>

                                SLA Normal

                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        EXPIRED
                    ================================================= */}

                    <div className="sla-status expired">

                        <ShieldAlert size={18} />

                        <div>

                            <strong>

                                {expiredSLA}

                            </strong>

                            <span>

                                SLA Terlewati

                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    NO DATA
                ================================================= */}

                {!hasSLAData && (

                    <div className="sla-empty-state">

                        Belum ada data SLA yang dapat dihitung
                        pada periode ini.

                    </div>

                )}

            </div>

        </div>

    );

}