import {
    TrendingUp,
    TrendingDown,
    Sparkles,
    Minus
} from "lucide-react";


export default function TrendComparisonCard({
    comparison
}) {

    if (!comparison) return null;


    const isUp =
        comparison.trend === "up";


    const isDown =
        comparison.trend === "down";


    const isNew =
        comparison.isNew;


    const color =
        isNew
            ? "#2563eb"
            : isUp
                ? "#16a34a"
                : isDown
                    ? "#dc2626"
                    : "#6b7280";


    const Icon =
        isNew
            ? Sparkles
            : isUp
                ? TrendingUp
                : isDown
                    ? TrendingDown
                    : Minus;


    const title =
        isNew
            ? "Aktivitas Baru"
            : isUp
                ? "Pertumbuhan Performa"
                : isDown
                    ? "Penurunan Performa"
                    : "Tidak Ada Perubahan Performa";


    const description =
        isNew
            ? "Belum ada data pada periode sebelumnya."
            : "Dibandingkan dengan periode sebelumnya.";


    return (

        <div className="trend-card">


            <div
                className="trend-card-accent"
                style={{
                    background: color
                }}
            />


            <div className="trend-card-body">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="trend-header">

                    <div>

                        <div className="trend-title">

                            Perbandingan

                        </div>


                        <div className="trend-subtitle">

                            Perbandingan tiket dengan
                            periode sebelumnya.

                        </div>

                    </div>


                    <div
                        className="trend-icon"
                        style={{
                            background:
                                `${color}15`
                        }}
                    >

                        <Icon
                            size={24}
                            color={color}
                            strokeWidth={2.3}
                        />

                    </div>

                </div>


                {/* =================================================
                    HERO
                ================================================= */}

                <div className="trend-hero">

                    <div
                        className="trend-value"
                        style={{
                            color,
                            fontSize: 52
                        }}
                    >

                        {

                            isNew

                                ? "BARU"

                                : `${Math.abs(
                                    comparison.percentage
                                )}%`

                        }

                    </div>


                    <div className="trend-hero-title">

                        {title}

                    </div>


                    <div className="trend-subtitle">

                        {description}

                    </div>

                </div>


                <hr className="trend-divider" />


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="trend-list">

                    <StatRow
                        label="Periode Saat Ini"
                        value={
                            comparison.current
                        }
                    />


                    <StatRow
                        label="Periode Sebelumnya"
                        value={
                            comparison.previous
                        }
                    />


                    <StatRow
                        label="Selisih"
                        value={
                            `${
                                comparison.difference > 0
                                    ? "+"
                                    : ""
                            }${
                                comparison.difference
                            }`
                        }
                        color={color}
                    />

                </div>

            </div>

        </div>

    );

}


function StatRow({
    label,
    value,
    color
}) {

    return (

        <div className="trend-item">

            <div className="trend-item-body">

                <div className="trend-item-row">

                    <span className="trend-item-label">

                        {label}

                    </span>


                    <strong
                        className="trend-item-value"
                        style={
                            color
                                ? { color }
                                : undefined
                        }
                    >

                        {value}

                    </strong>

                </div>

            </div>

        </div>

    );

}