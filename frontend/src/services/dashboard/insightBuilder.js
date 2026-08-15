export default function buildInsights({
    overview,
    engineers = [],
    teams = []
}) {

    const insights = [];


    // ==========================================================
    // TOP ENGINEER
    // ==========================================================

    const topEngineer =
        engineers[0] || null;


    // ==========================================================
    // TOP ASSIGNMENT
    // ==========================================================

    const topAssignment =
        [...engineers]
            .sort(
                (a, b) =>
                    (b.assigned || 0) -
                    (a.assigned || 0)
            )[0];


    // ==========================================================
    // TOP LOCATION
    // ==========================================================
    //
    // `teams` sekarang sebenarnya berisi
    // location groups dari teamAnalytics.
    //
    // AKR -> HO - AKR Tower
    // HO  -> Head Office
    //
    // ID "team" tetap dipertahankan untuk compatibility
    // dengan InsightCard.jsx.
    // ==========================================================

    const topLocation =
        [...teams]
            .sort(
                (a, b) =>
                    (b.completed || 0) -
                    (a.completed || 0)
            )[0];


    // ==========================================================
    // SYSTEM HEALTHY
    // ==========================================================

    if (
        (overview?.sla?.expiredSLA || 0) === 0
    ) {

        insights.push({

            id: "healthy",

            title: "SYSTEM HEALTHY",

            value: "SLA Aman",

            subtitle:
                "Seluruh ticket memenuhi SLA.",

            tone: "success",

            banner: false

        });

    } else {

        insights.push({

            id: "healthy",

            title: "SLA WARNING",

            value:
                `${overview.sla.expiredSLA} Ticket`,

            subtitle:
                "Ticket telah melewati batas SLA.",

            tone: "danger",

            banner: false

        });

    }


    // ==========================================================
    // TOP PERFORMER
    // ==========================================================

    if (
        topEngineer &&
        topEngineer.completed > 0
    ) {

        insights.push({

            id: "performer",

            title: "TOP PERFORMER",

            value:
                topEngineer.name,

            subtitle:
                `${topEngineer.completed} ticket selesai`,

            tone: "warning",

            banner: false

        });

    }


    // ==========================================================
    // TOP ASSIGNMENT
    // ==========================================================

    if (
        topAssignment &&
        topAssignment.assigned > 0
    ) {

        insights.push({

            id: "assignment",

            title: "TOP ASSIGNMENT",

            value:
                topAssignment.name,

            subtitle:
                `${topAssignment.assigned} ticket diterima`,

            tone: "info",

            banner: false

        });

    }


    // ==========================================================
    // TOP LOCATION
    // ==========================================================

    if (
        topLocation &&
        topLocation.completed > 0
    ) {

        insights.push({

            /*
            ------------------------------------------------------
            Tetap "team" untuk compatibility dengan:
                InsightCard.jsx
                cardIcons.team
            ------------------------------------------------------
            */

            id: "team",

            title: "TOP LOCATION",

            value:
                topLocation.name,

            subtitle:
                `${topLocation.completed} ticket selesai`,

            tone: "purple",

            banner: false

        });

    }


    // ==========================================================
    // OPERATIONAL BANNER
    // ==========================================================

    if (
        (overview?.process || 0) === 0
    ) {

        insights.push({

            id: "operational",

            title: "OPERATIONAL",

            value:
                "Semua pekerjaan selesai",

            subtitle:
                "Tidak ada ticket PROCESS saat ini.",

            tone: "success",

            banner: true

        });

    } else {

        insights.push({

            id: "operational",

            title: "OPERATIONAL",

            value:
                `${overview.process} Ticket Process`,

            subtitle:
                "Masih membutuhkan monitoring.",

            tone: "warning",

            banner: true

        });

    }


    // ==========================================================
    // RETURN
    // ==========================================================

    return insights;

}