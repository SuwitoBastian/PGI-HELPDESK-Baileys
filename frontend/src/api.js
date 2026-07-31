// Relatif '/api' -> di dev diproxy Vite ke :3000, di produksi same-origin.
const BASE = "/api";

/* ==========================================================
   Helper
========================================================== */

async function post(path, body) {

    const res = await fetch(`${BASE}${path}`, {

        method: "POST",

        headers: body
            ? {
                  "Content-Type": "application/json"
              }
            : undefined,

        body: body
            ? JSON.stringify(body)
            : undefined

    });

    if (!res.ok) {

        let msg = `Gagal (${res.status})`;

        try {

            const json = await res.json();

            if (json.error) {
                msg = json.error;
            }

        } catch {

            // Ignore

        }

        throw new Error(msg);

    }

    return res.json();

}

/* ==========================================================
   Dashboard
========================================================== */

export async function getDashboard(

    start = "",
    end = "",
    team = ""

) {

    const params = new URLSearchParams();

    if (start && end) {

        params.append("start", start);
        params.append("end", end);

    }

    if (team) {

        params.append("team", team);

    }

    const url = params.toString()

        ? `${BASE}/dashboard?${params.toString()}`

        : `${BASE}/dashboard`;

    const res = await fetch(url);

    if (!res.ok) {

        throw new Error(
            `Gagal memuat dashboard (${res.status})`
        );

    }

    return res.json();

}

/* ==========================================================
   Analytics
========================================================== */

export async function getAnalytics(

    start = "",
    end = "",
    team = ""

) {

    const params = new URLSearchParams();

    if (start && end) {

        params.append("start", start);
        params.append("end", end);

    }

    if (team) {

        params.append("team", team);

    }

    const url = params.toString()

        ? `${BASE}/analytics?${params.toString()}`

        : `${BASE}/analytics`;

    const res = await fetch(url);

    if (!res.ok) {

        throw new Error(
            `Gagal memuat analytics (${res.status})`
        );

    }

    return res.json();

}

/* ==========================================================
   Customer Feedback
========================================================== */

export async function getFeedback(filters = {}) {

    const params = new URLSearchParams();

    if (filters.startDate) {

        params.append(
            "startDate",
            filters.startDate
        );

    }

    if (filters.endDate) {

        params.append(
            "endDate",
            filters.endDate
        );

    }

    if (
        filters.team &&
        filters.team !== "ALL"
    ) {

        params.append(
            "team",
            filters.team
        );

    }

    if (
        filters.keyword &&
        filters.keyword.trim()
    ) {

        params.append(
            "keyword",
            filters.keyword.trim()
        );

    }

    const url = params.toString()

        ? `${BASE}/feedback?${params.toString()}`

        : `${BASE}/feedback`;

    const res = await fetch(url);

    if (!res.ok) {

        throw new Error(
            `Gagal memuat customer feedback (${res.status})`
        );

    }

    return res.json();

}

/* ==========================================================
   Export Customer Feedback Excel
========================================================== */

export function exportFeedbackExcel(filters = {}) {

    const params = new URLSearchParams();

    if (filters.startDate) {

        params.append(
            "startDate",
            filters.startDate
        );

    }

    if (filters.endDate) {

        params.append(
            "endDate",
            filters.endDate
        );

    }

    if (
        filters.team &&
        filters.team !== "ALL"
    ) {

        params.append(
            "team",
            filters.team
        );

    }

    if (
        filters.keyword &&
        filters.keyword.trim()
    ) {

        params.append(
            "keyword",
            filters.keyword.trim()
        );

    }

    const url = params.toString()

        ? `${BASE}/feedback/export?${params.toString()}`
        : `${BASE}/feedback/export`;

    window.open(url, "_blank");

}

/* ==========================================================
   Operational Rotation
========================================================== */

export async function getOperationalRotation() {

    const res = await fetch(
        `${BASE}/operational-rotation`
    );

    if (!res.ok) {

        throw new Error(
            `Gagal memuat operational rotation (${res.status})`
        );

    }

    return res.json();

}

/* ==========================================================
   Ticket Actions
========================================================== */

export const closeTicket = (id) =>
    post(
        `/tickets/${encodeURIComponent(id)}/close`
    );

export const openTicket = (id) =>
    post(
        `/tickets/${encodeURIComponent(id)}/open`
    );

export const assignPIC = (id, pic) =>
    post(
        `/tickets/${encodeURIComponent(id)}/assign`,
        { pic }
    );

export const changeStatus = (id, status) =>
    post(
        `/tickets/${encodeURIComponent(id)}/status`,
        { status }
    );