import { useCallback, useEffect, useRef, useState } from "react";
import {
    getDashboard,
    getAnalytics,
    getOperationalRotation
} from "../api";

import { getDailyTrend } from "../services/dashboard/trendService";

// Ambil data dashboard + polling tiap 30 detik.
export function useDashboard(
    start = "",
    end = "",
    team = "",
    intervalMs = 30000
) {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const timer = useRef(null);

    const refresh = useCallback(async () => {

        try {

            const [
                dashboard,
                analytics,
                rotation,
                trend
            ] = await Promise.all([
                getDashboard(
                    start,
                    end,
                    team
                ),

                getAnalytics(
                    start,
                    end,
                    team
                ),

                getOperationalRotation(),

                getDailyTrend({
                    startDate: start,
                    endDate: end,
                    team
                })
            ]);

            setData({
                ...dashboard,
                analytics,
                rotation,
                trend: trend?.trend || trend || []
            });

            setError(null);

        } catch (e) {

            console.error(e);

            setError(e.message);

        } finally {

            setLoading(false);

        }

    }, [
        start,
        end,
        team
    ]);

    useEffect(() => {

        refresh();

        timer.current = setInterval(
            refresh,
            intervalMs
        );

        return () => clearInterval(timer.current);

    }, [
        refresh,
        intervalMs
    ]);

    return {
        data,
        error,
        loading,
        refresh
    };

}