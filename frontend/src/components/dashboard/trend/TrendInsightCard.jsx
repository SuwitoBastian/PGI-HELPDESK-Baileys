import {
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Flame,
    CalendarDays,
    ClipboardList,
    CircleAlert
} from "lucide-react";


// =====================================================
// INSIGHT CONFIG
// =====================================================

function getInsightConfig(item) {

    const text =
        String(item?.text || "")
            .toLowerCase();


    if (text.includes("naik")) {

        return {
            title: "Trend",
            color: "#16a34a",
            bg: "#dcfce7",
            Icon: TrendingUp
        };

    }


    if (text.includes("turun")) {

        return {
            title: "Trend",
            color: "#dc2626",
            bg: "#fee2e2",
            Icon: TrendingDown
        };

    }


    if (text.includes("peak") ||
        text.includes("puncak")) {

        return {
            title: "Peak",
            color: "#f59e0b",
            bg: "#fef3c7",
            Icon: Flame
        };

    }


    if (text.includes("average") ||
        text.includes("rata-rata")) {

        return {
            title: "Average",
            color: "#2563eb",
            bg: "#dbeafe",
            Icon: CalendarDays
        };

    }


    if (text.includes("total")) {

        return {
            title: "Volume",
            color: "#64748b",
            bg: "#f1f5f9",
            Icon: ClipboardList
        };

    }


    return {
        title: "Insight",
        color: "#6366f1",
        bg: "#eef2ff",
        Icon: CircleAlert
    };

}


// =====================================================
// COMPONENT
// =====================================================

export default function TrendInsightCard({

    insight = []

}) {

    if (!insight.length) {
        return null;
    }


    return (

        <div className="trend-card">


            {/* =================================================
                ACCENT
            ================================================= */}

            <div
                className="trend-card-accent"
                style={{
                    background: "#6366f1"
                }}
            />


            <div className="trend-card-body">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="trend-header">

                    <div>

                        <div className="trend-title">

                            Trend Insights

                        </div>


                        <div className="trend-subtitle">

                            Ringkasan otomatis berdasarkan
                            aktivitas ticket.

                        </div>

                    </div>


                    <div
                        className="trend-icon"
                        style={{
                            background: "#eef2ff"
                        }}
                    >

                        <Lightbulb
                            size={24}
                            color="#6366f1"
                            strokeWidth={2}
                        />

                    </div>

                </div>


                {/* =================================================
                    INSIGHT LIST
                ================================================= */}

                <div className="trend-list">

                    {insight.map(
                        (item, index) => {

                            const config =
                                getInsightConfig(
                                    item
                                );

                            const Icon =
                                config.Icon;


                            return (

                                <div
                                    key={index}
                                    className="trend-item"
                                >


                                    {/* =========================================
                                        ICON
                                    ========================================= */}

                                    <div
                                        className="trend-icon"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background:
                                                config.bg
                                        }}
                                    >

                                        <Icon
                                            size={18}
                                            color={
                                                config.color
                                            }
                                            strokeWidth={2}
                                        />

                                    </div>


                                    {/* =========================================
                                        CONTENT
                                    ========================================= */}

                                    <div className="trend-item-body">

                                        <span
                                            className="trend-item-title"
                                            style={{
                                                background:
                                                    config.bg,
                                                color:
                                                    config.color
                                            }}
                                        >

                                            {config.title}

                                        </span>


                                        <p className="trend-item-text">

                                            {item.text}

                                        </p>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>

        </div>

    );

}