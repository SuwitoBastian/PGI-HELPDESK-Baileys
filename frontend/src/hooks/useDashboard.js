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
// enabled:
//   true  = fetch data
//   false = tidak fetch
//
// Polling setiap 30 detik.
// =====================================================

export function useDashboard(
    start = "",
    end = "",
    location = "",
    intervalMs = 30000,
    enabled = true
) {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const timer = useRef(null);


    // =====================================================
    // REFRESH
    // =====================================================

    const refresh = useCallback(async () => {

        // -------------------------------------------------
        // JANGAN FETCH JIKA TIDAK ENABLED
        // -------------------------------------------------

        if (!enabled) {

            return;

        }


        try {

            setLoading(true);

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

                trend:
                    trend?.trend ||
                    trend ||
                    []

            });


            setError(null);

        } catch (e) {

            console.error(
                "useDashboard error:",
                e
            );

            setError(
                e?.message ||
                "Gagal memuat data dashboard."
            );

        } finally {

            setLoading(false);

        }

    }, [
        start,
        end,
        location,
        enabled
    ]);


    // =====================================================
    // POLLING
    // =====================================================

    useEffect(() => {

        // -------------------------------------------------
        // CLEAR TIMER LAMA
        // -------------------------------------------------

        if (timer.current) {

            clearInterval(
                timer.current
            );

            timer.current = null;

        }


        // -------------------------------------------------
        // GUEST
        // -------------------------------------------------

        if (!enabled) {

            setData(null);
            setError(null);
            setLoading(false);

            return;

        }


        // -------------------------------------------------
        // INITIAL LOAD
        // -------------------------------------------------

        refresh();


        // -------------------------------------------------
        // POLLING 30 DETIK
        // -------------------------------------------------

        timer.current = setInterval(
            refresh,
            intervalMs
        );


        // -------------------------------------------------
        // CLEANUP
        // -------------------------------------------------

        return () => {

            if (timer.current) {

                clearInterval(
                    timer.current
                );

                timer.current = null;

            }

        };

    }, [
        refresh,
        intervalMs,
        enabled
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