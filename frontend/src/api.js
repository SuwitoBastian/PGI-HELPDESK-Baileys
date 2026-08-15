// Relatif '/api' -> di dev diproxy Vite ke :3000,
// di produksi same-origin.

const BASE = "/api";


/* ==========================================================
   Helper
========================================================== */

async function post(path, body) {

    const res =
        await fetch(
            `${BASE}${path}`,
            {
                method: "POST",

                headers: body
                    ? {
                        "Content-Type": "application/json"
                    }
                    : undefined,

                body: body
                    ? JSON.stringify(body)
                    : undefined
            }
        );


    if (!res.ok) {

        let msg =
            `Gagal (${res.status})`;

        try {

            const json =
                await res.json();

            if (json.error) {

                msg =
                    json.error;

            }

        }

        catch {

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
    location = ""

) {

    const params =
        new URLSearchParams();


    if (start && end) {

        params.append(
            "start",
            start
        );

        params.append(
            "end",
            end
        );

    }


    if (location) {

        params.append(
            "location",
            location
        );

    }


    const url =
        params.toString()

            ? `${BASE}/dashboard?${params.toString()}`

            : `${BASE}/dashboard`;


    const res =
        await fetch(url);


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
    location = ""

) {

    const params =
        new URLSearchParams();


    if (start && end) {

        params.append(
            "start",
            start
        );

        params.append(
            "end",
            end
        );

    }


    if (location) {

        params.append(
            "location",
            location
        );

    }


    const url =
        params.toString()

            ? `${BASE}/analytics?${params.toString()}`

            : `${BASE}/analytics`;


    const res =
        await fetch(url);


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

export async function getFeedback(
    filters = {}
) {

    const params =
        new URLSearchParams();


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


    /*
    ==========================================================
    LOCATION
    ==========================================================
    */

    if (
        filters.location &&
        filters.location !== "ALL"
    ) {

        params.append(
            "location",
            filters.location
        );

    }


    /*
    ==========================================================
    LEGACY TEAM
    ==========================================================

    Tetap support caller lama.

    Kalau location ada,
    team tidak dikirim.
    ==========================================================
    */

    else if (
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


    const url =
        params.toString()

            ? `${BASE}/feedback?${params.toString()}`

            : `${BASE}/feedback`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Gagal mengambil data customer feedback"
        );

    }


    return response.json();

}


/* ==========================================================
   Export Customer Feedback Excel
========================================================== */

export function exportFeedbackExcel(
    filters = {}
) {

    const params =
        new URLSearchParams();


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


    /*
    ==========================================================
    LOCATION
    ==========================================================
    */

    if (
        filters.location &&
        filters.location !== "ALL"
    ) {

        params.append(
            "location",
            filters.location
        );

    }


    /*
    ==========================================================
    LEGACY TEAM
    ==========================================================

    Kalau masih ada caller lama yang mengirim team,
    tetap kita dukung.

    Jika location ada, team tidak ikut dikirim.
    ==========================================================
    */

    else if (
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


    const url =
        params.toString()

            ? `${BASE}/feedback/export?${params.toString()}`

            : `${BASE}/feedback/export`;


    window.open(
        url,
        "_blank"
    );

}


/* ==========================================================
   Operational Rotation
========================================================== */

export async function getOperationalRotation() {

    const res =
        await fetch(
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


export const assignPIC = (
    id,
    pic
) =>

    post(
        `/tickets/${encodeURIComponent(id)}/assign`,
        {
            pic
        }
    );


export const changeStatus = (
    id,
    status
) =>

    post(
        `/tickets/${encodeURIComponent(id)}/status`,
        {
            status
        }
    );