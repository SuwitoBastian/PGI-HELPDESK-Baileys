import {
    Clock3,
    TimerReset,
    Timer,
    ShieldCheck,
    ShieldAlert
} from "lucide-react";

function getResponseStatus(minutes) {

    if (minutes <= 5) {
        return {
            text: "Excellent",
            className: "excellent"
        };
    }

    if (minutes <= 10) {
        return {
            text: "Good",
            className: "good"
        };
    }

    return {
        text: "Slow",
        className: "warning"
    };

}

function getResolutionStatus(minutes) {

    if (minutes <= 30) {
        return {
            text: "Good",
            className: "excellent"
        };
    }

    if (minutes <= 60) {
        return {
            text: "Average",
            className: "good"
        };
    }

    return {
        text: "Over SLA",
        className: "warning"
    };

}

export default function SLAPerformanceCard({ sla }) {

    if (!sla) return null;

    const response = getResponseStatus(
        sla.averageResponseTime
    );

    const resolution = getResolutionStatus(
        sla.averageResolutionTime
    );

    const successRate =
        sla.totalTicket > 0
            ? Math.round(
                (sla.normalSLA / sla.totalTicket) * 100
            )
            : 0;

    return (

        <div className="card sla-performance-card">

            <div className="card-header">

                <h3 className="card-title">
                    SLA Performance
                </h3>

                <p className="card-description">
                    Rata-rata performa penyelesaian tiket.
                </p>

            </div>

            <div className="card-content">

                <div className="sla-list">

                    <div className="sla-row">

                        <div className="sla-left">

                            <Clock3 size={18} />

                            <div>

                                <span>Avg Response</span>

                                <strong>
                                    {sla.averageResponseTime} menit
                                </strong>

                            </div>

                        </div>

                        <span className={`sla-badge ${response.className}`}>
                            {response.text}
                        </span>

                    </div>

                    <div className="sla-row">

                        <div className="sla-left">

                            <TimerReset size={18} />

                            <div>

                                <span>Avg Resolution</span>

                                <strong>
                                    {sla.averageResolutionTime} menit
                                </strong>

                            </div>

                        </div>

                        <span className={`sla-badge ${resolution.className}`}>
                            {resolution.text}
                        </span>

                    </div>

                    <div className="sla-row">

                        <div className="sla-left">

                            <Timer size={18} />

                            <div>

                                <span>Total Duration</span>

                                <strong>
                                    {sla.averageTotalDuration} menit
                                </strong>

                            </div>

                        </div>

                        <span className="sla-badge neutral">
                            OPEN → CLOSED
                        </span>

                    </div>

                </div>

                <div className="sla-progress">

                    <div className="sla-progress-header">

                        <span>SLA Success Rate</span>

                        <strong>
                            {successRate}%
                        </strong>

                    </div>

                    <div className="sla-progress-bar">

                        <div
                            className="sla-progress-fill"
                            style={{
                                width: `${successRate}%`
                            }}
                        />

                    </div>

                </div>

                <div className="sla-footer">

                    <div className="sla-status normal">

                        <ShieldCheck size={18} />

                        <div>

                            <strong>
                                {sla.normalSLA}
                            </strong>

                            <span>
                                Normal SLA
                            </span>

                        </div>

                    </div>

                    <div className="sla-status expired">

                        <ShieldAlert size={18} />

                        <div>

                            <strong>
                                {sla.expiredSLA}
                            </strong>

                            <span>
                                Expired SLA
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}