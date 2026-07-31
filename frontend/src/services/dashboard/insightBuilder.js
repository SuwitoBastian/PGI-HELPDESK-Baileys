export default function buildInsights({
    overview,
    engineers = [],
    teams = []
}) {

    const insights = [];

    const topEngineer =
        engineers[0] || null;

    const topAssignment =
        [...engineers]
            .sort((a, b) => b.assigned - a.assigned)[0];

    const bestTeam =
        [...teams]
            .sort((a, b) => b.completed - a.completed)[0];

    // ==========================================================
    // System Healthy
    // ==========================================================

    if (overview?.sla?.expiredSLA === 0) {

        insights.push({

            id: "healthy",

            title: "SYSTEM HEALTHY",

            value: "SLA Aman",

            subtitle: "Seluruh ticket memenuhi SLA.",

            tone: "success",

            banner: false

        });

    } else {

        insights.push({

            id: "healthy",

            title: "SLA WARNING",

            value: `${overview.sla.expiredSLA} Ticket`,

            subtitle: "Ticket telah melewati batas SLA.",

            tone: "danger",

            banner: false

        });

    }

    // ==========================================================
    // Top Performer
    // ==========================================================

    if (topEngineer && topEngineer.completed > 0) {

        insights.push({

            id: "performer",

            title: "TOP PERFORMER",

            value: topEngineer.name,

            subtitle: `${topEngineer.completed} ticket selesai`,

            tone: "warning",

            banner: false

        });

    }

    // ==========================================================
    // Top Assignment
    // ==========================================================

    if (topAssignment && topAssignment.assigned > 0) {

        insights.push({

            id: "assignment",

            title: "TOP ASSIGNMENT",

            value: topAssignment.name,

            subtitle: `${topAssignment.assigned} ticket diterima`,

            tone: "info",

            banner: false

        });

    }

    // ==========================================================
    // Best Team
    // ==========================================================

    if (bestTeam && bestTeam.completed > 0) {

        insights.push({

            id: "team",

            title: "BEST TEAM",

            value: bestTeam.name,

            subtitle: `${bestTeam.completed} ticket selesai`,

            tone: "purple",

            banner: false

        });

    }

    // ==========================================================
    // Operational Banner
    // ==========================================================

    if (overview?.process === 0) {

        insights.push({

            id: "operational",

            title: "OPERATIONAL",

            value: "Semua pekerjaan selesai",

            subtitle: "Tidak ada ticket PROCESS saat ini.",

            tone: "success",

            banner: true

        });

    } else {

        insights.push({

            id: "operational",

            title: "OPERATIONAL",

            value: `${overview.process} Ticket Process`,

            subtitle: "Masih membutuhkan monitoring.",

            tone: "warning",

            banner: true

        });

    }

    return insights;

}