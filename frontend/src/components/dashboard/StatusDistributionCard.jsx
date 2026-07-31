import { PieChart as PieIcon } from "lucide-react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";

const COLORS = [
    "#f59e0b", // OPEN
    "#2563eb", // PROCESS
    "#22c55e"  // CLOSED
];

export default function StatusDistributionCard({ data }) {

    const total = data?.total || 0;

    const statusData = [
        {
            key: "OPEN",
            label: "Open",
            value: data?.open || 0,
            color: COLORS[0]
        },
        {
            key: "PROCESS",
            label: "Dalam Proses",
            value: data?.process || 0,
            color: COLORS[1]
        },
        {
            key: "CLOSED",
            label: "Selesai",
            value: data?.closed || 0,
            color: COLORS[2]
        }
    ];

    return (
        <div className="card status-card">

            {/* ========================= */}
            {/* Header */}
            {/* ========================= */}

            <div className="card-header">

                <div className="card-title">
                    <PieIcon size={20} />
                    <span>Distribusi Status</span>
                </div>

                <p className="card-description">
                    Persentase tiket berdasarkan status saat ini.
                </p>

            </div>

            {/* ========================= */}
            {/* Body */}
            {/* ========================= */}

            <div className="card-content">

                <div className="status-body">

                    {/* ========================= */}
                    {/* Chart */}
                    {/* ========================= */}

                    <div className="status-chart">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="label"
                                    innerRadius={74}
                                    outerRadius={108}
                                    paddingAngle={3}
                                    cornerRadius={8}
                                    stroke="#fff"
                                    strokeWidth={4}
                                    isAnimationActive
                                    animationDuration={1000}
                                    animationEasing="ease-out"
                                >

                                    {statusData.map(item => (

                                        <Cell
                                            key={item.key}
                                            fill={item.color}
                                        />

                                    ))}

                                </Pie>

                                <Tooltip
                                    formatter={(value, name) => [
                                        `${value} tiket`,
                                        name
                                    ]}
                                />

                            </PieChart>

                        </ResponsiveContainer>

                        <div className="status-center">

                            <strong>{total}</strong>

                            <span>Total Ticket</span>

                        </div>

                    </div>

                    {/* ========================= */}
                    {/* Legend */}
                    {/* ========================= */}

                    <div className="status-list">

                        {statusData.map(item => {

                            const percent =
                                total === 0
                                    ? 0
                                    : Math.round(
                                          (item.value / total) * 100
                                      );

                            return (

                                <div
                                    key={item.key}
                                    className="status-row"
                                >

                                    <div className="status-info">

                                        <span
                                            className="status-dot"
                                            style={{
                                                background: item.color
                                            }}
                                        />

                                        <div>

                                            <div className="status-label">
                                                {item.label}
                                            </div>

                                            <div className="status-ticket">
                                                {item.value} tiket
                                            </div>

                                        </div>

                                    </div>

                                    <div className="status-value">

                                        {percent}%

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </div>

            </div>

        </div>
    );

}