import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";


function formatDate(date) {

    const d =
        new Date(date);

    return d.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short"
        }
    );

}


// =====================================================
// RANGE LABEL
// =====================================================

function getRangeLabel(range) {

    switch (range) {

        case 7:
            return "7 Hari Terakhir";

        case 30:
            return "30 Hari Terakhir";

        case 90:
            return "90 Hari Terakhir";

        case "ALL":
            return "Semua Periode";

        default:
            return "Periode Terpilih";

    }

}


// =====================================================
// COMPONENT
// =====================================================

export default function DailyTrendCard({

    trend = [],

    range = 30

}) {

    const rangeLabel =
        getRangeLabel(range);


    return (

        <div className="trend-card">


            <div
                className="trend-card-accent"
                style={{
                    background: "#2563eb"
                }}
            />


            <div className="trend-card-body">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="trend-header">

                    <div>

                        <div className="trend-title">

                            Tren Tiket Harian

                        </div>


                        <div className="trend-subtitle">

                            Jumlah tiket per hari

                        </div>

                    </div>


                    <div
                        className="trend-badge"
                        style={{
                            background: "#eff6ff",
                            color: "#2563eb"
                        }}
                    >

                        {rangeLabel}

                    </div>

                </div>


                {/* =================================================
                    CHART
                ================================================= */}

                <div
                    style={{
                        width: "100%",
                        height: 360
                    }}
                >

                    {trend.length === 0 ? (

                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#94a3b8",
                                fontSize: 14
                            }}
                        >

                            Tidak ada data.

                        </div>

                    ) : (

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <LineChart
                                data={trend}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 10
                                }}
                            >

                                <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="4 4"
                                    stroke="#e5e7eb"
                                />


                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                    interval="preserveStartEnd"
                                    minTickGap={50}
                                    tick={{
                                        fontSize: 12,
                                        fill: "#6b7280"
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                />


                                <YAxis
                                    allowDecimals={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: "#6b7280"
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                />


                                <Tooltip
                                    labelFormatter={formatDate}
                                    formatter={(value) => [
                                        `${value} Tiket`,
                                        "Total"
                                    ]}
                                />


                                <Line
                                    type="linear"
                                    dataKey="total"
                                    name="Total Tiket"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{
                                        r: 4
                                    }}
                                    activeDot={{
                                        r: 6
                                    }}
                                    connectNulls={false}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    )}

                </div>

            </div>

        </div>

    );

}