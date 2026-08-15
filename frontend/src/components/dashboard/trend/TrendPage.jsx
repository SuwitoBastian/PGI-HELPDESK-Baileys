import { useEffect, useState } from "react";
import DailyTrendCard from "./DailyTrendCard";
import TrendSummaryCard from "./TrendSummaryCard";
import TrendComparisonCard from "./TrendComparisonCard";
import TrendInsightCard from "./TrendInsightCard";
import { getDailyTrend } from "../../../services/dashboard/trendService";

const RANGE_OPTIONS = [
    { label: "7 Hari", value: 7 },
    { label: "30 Hari", value: 30 },
    { label: "90 Hari", value: 90 },
    { label: "Semua", value: "ALL" }
];

export default function TrendPage({
    data,
    team = "ALL",
    location = ""
}) {

    const [range, setRange] = useState(30);

    const [trendData, setTrendData] = useState({
        summary: data.summary || {
            totalTicket: 0,
            averagePerDay: 0,
            peakDay: null,
            peakTicket: 0
        },
        comparison: data.comparison || {
            current: 0,
            previous: 0,
            difference: 0,
            percentage: 0,
            trend: "flat"
        },
        insight: data.insight || [],
        trend: data.trend || []
    });

    useEffect(() => {

        async function loadTrend() {

            try {

                const result = await getDailyTrend({
                    days: range === "ALL" ? null : range,
                    location
                });

                setTrendData({
                    summary: result.summary ?? {
                        totalTicket: 0,
                        averagePerDay: 0,
                        peakDay: null,
                        peakTicket: 0
                    },
                    comparison: result.comparison ?? {
                        current: 0,
                        previous: 0,
                        difference: 0,
                        percentage: 0,
                        trend: "flat"
                    },
                    insight: result.insight ?? [],
                    trend: result.trend ?? []
                });

            } catch (err) {

                console.error("Trend Error:", err);

            }

        }

        loadTrend();

    }, [range, location]);

    return (

        <>

            <div className="trend-toolbar">

                <select
                    value={range}
                    onChange={(e) => {

                        const value = e.target.value;

                        setRange(
                            value === "ALL"
                                ? "ALL"
                                : Number(value)
                        );

                    }}
                    className="trend-select"
                >

                    {RANGE_OPTIONS.map(option => (

                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>

                    ))}

                </select>

            </div>

            <TrendSummaryCard
                summary={trendData.summary}
            />

            <div
                className={
                    range === "ALL"
                        ? "trend-content-grid-single"
                        : "trend-content-grid"
                }
            >

                {range !== "ALL" && (

                    <TrendComparisonCard
                        comparison={trendData.comparison}
                    />

                )}

                <TrendInsightCard
                    insight={trendData.insight}
                />

            </div>

            <DailyTrendCard
                trend={trendData.trend}
                range={range}
            />

        </>

    );

}