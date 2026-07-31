import { Clock3, CheckCircle2, Loader2, CircleDot } from "lucide-react";
import { formatDuration } from "../../utils/formatDuration";

function formatTime(dateString) {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

export default function RecentActivityCard({ tickets = [] }) {

    const recent = [...tickets]
        .sort((a, b) => {

            const aTime = new Date(b.selesai || b.waktu);
            const bTime = new Date(a.selesai || a.waktu);

            return aTime - bTime;

        })
        .slice(0, 5);

    function getActivity(ticket) {

        switch (ticket.status) {

            case "CLOSED":
                return {
                    icon: <CheckCircle2 size={18} />,
                    color: "success",
                    title: `${ticket.pic_selesai || "-"} menyelesaikan tiket`,
                    subtitle: `Cabang ${ticket.cabang || "-"}`,
                };

            case "PROCESS":
                return {
                    icon: <Loader2 size={18} className="spin" />,
                    color: "process",
                    title: `${ticket.pic || "-"} mengambil tiket`,
                    subtitle: `Cabang ${ticket.cabang || "-"}`,
                };

            default:
                return {
                    icon: <CircleDot size={18} />,
                    color: "open",
                    title: "Ticket Baru Masuk",
                    subtitle: `Cabang ${ticket.cabang || "-"}`,
                };

        }

    }

    return (

        <div className="card recent-activity-card">

            <div className="card-header">

                <div className="card-title">
                    <Clock3 size={20} />
                    <span>Aktivitas Terbaru</span>
                </div>

                <p className="card-description">
                    Lima aktivitas Helpdesk terbaru.
                </p>

            </div>

            <div className="card-content">

                <div className="activity-list">

                    {recent.map(ticket => {

                        const item = getActivity(ticket);

                        return (

                            <div
                                className="activity-item"
                                key={ticket.id}
                            >

                                <div className={`activity-icon ${item.color}`}>

                                    {item.icon}

                                </div>

                                <div className="activity-main">

                                    <div className="activity-title">

                                        {item.title}

                                    </div>

                                    <div className="activity-subtitle">

                                        {item.subtitle}

                                    </div>

                                    <div
                                        className="activity-desc"
                                        title={ticket.kendala}
                                    >

                                        "{ticket.kendala}"

                                    </div>
                                    {ticket.status === "CLOSED" && ticket.durasi && (
                                        <div className="activity-duration">
                                            ⏱ {formatDuration(ticket.durasi)}
                                        </div>
                                    )}

                                </div>

                                    <div
                                        className="activity-time"
                                        title={ticket.selesai || ticket.waktu}
                                    >

                                        {formatTime(ticket.selesai || ticket.waktu)}

                                    </div>

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>

    );

}