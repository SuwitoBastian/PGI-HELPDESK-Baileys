import {
    ClipboardList,
    TrendingUp,
    Trophy,
    Flame
} from "lucide-react";


function formatDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short"
    });

}


export default function TrendSummary({ summary }) {

    const cards = [

        {
            title: "Total Tiket",

            value:
                summary?.totalTicket ?? 0,

            icon:
                ClipboardList,

            description:
                "Total tiket pada periode terpilih",

            color:
                "#2563eb"
        },


        {
            title: "Rata-rata / Hari",

            value:
                summary?.averagePerDay ?? 0,

            icon:
                TrendingUp,

            description:
                "Rata-rata tiket setiap hari",

            color:
                "#16a34a"
        },


        {
            title: "Hari Tertinggi",

            value:
                formatDate(
                    summary?.peakDay
                ),

            icon:
                Trophy,

            description:
                "Hari dengan tiket terbanyak",

            color:
                "#f59e0b"
        },


        {
            title: "Tiket Tertinggi",

            value:
                summary?.peakTicket ?? 0,

            icon:
                Flame,

            description:
                "Jumlah tiket tertinggi dalam sehari",

            color:
                "#ef4444"
        }

    ];


    return (

        <div className="trend-summary-grid">

            {cards.map((card) => {

                const Icon =
                    card.icon;


                return (

                    <div
                        key={card.title}
                        className="trend-card"
                    >

                        <div
                            className="trend-card-accent"
                            style={{
                                background:
                                    card.color
                            }}
                        />


                        <div className="trend-card-body">


                            {/* =================================================
                                HEADER
                            ================================================= */}

                            <div className="trend-header">

                                <div>

                                    <div
                                        className="trend-subtitle"
                                        style={{
                                            marginTop: 0,
                                            textTransform:
                                                "uppercase",
                                            fontWeight: 700,
                                            letterSpacing:
                                                ".4px"
                                        }}
                                    >

                                        {card.title}

                                    </div>

                                </div>


                                <div
                                    className="trend-icon"
                                    style={{
                                        background:
                                            `${card.color}15`
                                    }}
                                >

                                    <Icon
                                        size={24}
                                        color={
                                            card.color
                                        }
                                        strokeWidth={2.2}
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                VALUE
                            ================================================= */}

                            <div className="trend-value">

                                {card.value}

                            </div>


                            {/* =================================================
                                DESCRIPTION
                            ================================================= */}

                            <div className="trend-label">

                                {card.description}

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}