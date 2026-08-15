import { useCallback, useEffect, useRef, useState } from "react";

import {
    getDashboard,
    getAnalytics,
    getOperationalRotation
} from "../api";

import { getDailyTrend } from "../services/dashboard/trendService";


// =====================================================
// DASHBOARD HOOK
// =====================================================
// Mengambil:
// - Dashboard
// - Analytics
// - Operational Rotation
// - Daily Trend
//
// location:
//   ""    = ALL
//   "AKR" = HO - AKR Tower
//   "HO"  = Head Office
//
// Polling setiap 30 detik.
// =====================================================

export function useDashboard(
    start = "",
    end = "",
    location = "",
    intervalMs = 30000
) {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const timer = useRef(null);


    // =====================================================
    // REFRESH
    // =====================================================

    const refresh = useCallback(async () => {

        try {

            const [
                dashboard,
                analytics,
                rotation,
                trend
            ] = await Promise.all([

                // Dashboard
                getDashboard(
                    start,
                    end,
                    location
                ),

                // Analytics
                getAnalytics(
                    start,
                    end,
                    location
                ),

                // Operational Rotation
                getOperationalRotation(),

                // Daily Trend
                getDailyTrend({
                    startDate: start,
                    endDate: end,
                    location
                })

            ]);


            // =====================================================
            // SET DATA
            // =====================================================

            setData({
                ...dashboard,

                analytics,

                rotation,

                trend: trend?.trend || trend || []
            });


            setError(null);

        } catch (e) {

            console.error(
                "useDashboard error:",
                e
            );

            setError(
                e?.message || "Gagal memuat data dashboard."
            );

        } finally {

            setLoading(false);

        }

    }, [
        start,
        end,
        location
    ]);


    // =====================================================
    // POLLING
    // =====================================================

    useEffect(() => {

        refresh();

        timer.current = setInterval(
            refresh,
            intervalMs
        );


        return () => {

            if (timer.current) {
                clearInterval(timer.current);
            }

        };

    }, [
        refresh,
        intervalMs
    ]);


    // =====================================================
    // RETURN
    // =====================================================

    return {
        data,
        error,
        loading,
        refresh
    };

}