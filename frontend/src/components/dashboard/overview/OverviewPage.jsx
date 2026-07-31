import { ArrowLeftRight } from "lucide-react";

import StatCards from "../../StatCards";
import InsightCard from "../InsightCard";
import RecentActivityCard from "../RecentActivityCard";

export default function OverviewPage({ data }) {

    const rotation = data?.rotation?.current;

    console.log("ROTATION:", data?.rotation);

    const monthNames = [
        "",
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];

    const rotationPeriod = rotation
        ? `${monthNames[rotation.month]} ${rotation.year}`
        : "-";

    return (
        <>

            <div className="performance-card">

                <div className="performance-header">

                    <div>

                        <h2 className="performance-title">
                            All Performance
                        </h2>

                        <p className="performance-subtitle">
                            Ringkasan performa seluruh Helpdesk.
                        </p>

                    </div>

                    <div className="rotation-badge">

                        <div className="rotation-label">

                            <ArrowLeftRight
                                size={13}
                                strokeWidth={2}
                            />

                            <span>
                                Operational Rotation
                            </span>

                        </div>

                        <div className="performance-rotation-row">

                            <span className="performance-rotation-key">
                                Primary Team
                            </span>

                            <span className="performance-rotation-team primary">
                                {rotation?.primaryTeam?.replace("_", " ") || "-"}
                            </span>

                        </div>

                        <div className="performance-rotation-row">

                            <span className="performance-rotation-key">
                                Backup Team
                            </span>

                            <span className="performance-rotation-team backup">
                                {rotation?.backupTeam?.replace("_", " ") || "-"}
                            </span>

                        </div>

                        <div className="performance-rotation-divider"></div>

                        <div className="performance-rotation-next-title">
                            Next Rotation
                        </div>

                        <div className="performance-rotation-next-value">

                            {data?.rotation?.next
                                ? `${data.rotation.next.primaryTeam.replace("_", " ")} → ${data.rotation.next.backupTeam.replace("_", " ")}`
                                : "-"}

                        </div>

                        <div className="rotation-period">

                            {data?.rotation?.next
                                ? `${monthNames[data.rotation.next.month]} ${data.rotation.next.year}`
                                : "-"}

                        </div>

                    </div>

                </div>

                <StatCards data={data} />

            </div>

            <InsightCard
                overview={data.analytics?.overview}
                engineers={data.analytics?.engineers || []}
                teams={data.analytics?.teams || []}
            />

            <RecentActivityCard
                tickets={data.tickets || []}
            />

        </>
    );

}