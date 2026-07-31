/* ==========================================================
 * HELPERS
 * ==========================================================
 */

export const PAGE_SIZES = [10, 25, 50, 100];

export function fmt(dt) {
    if (!dt) return "-";

    return new Date(dt).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

export function statusBadge(status) {

    switch (status) {

        case "OPEN":
            return {
                cls: "badge-open",
                label: "OPEN"
            };

        case "PROCESS":
            return {
                cls: "badge-process",
                label: "PROCESS"
            };

        case "CLOSED":
            return {
                cls: "badge-closed",
                label: "CLOSED"
            };

        default:
            return {
                cls: "badge-default",
                label: status || "-"
            };

    }

}

export function slaClass(durasi) {

    if (!durasi) return "";

    const number = parseInt(durasi, 10);

    if (isNaN(number)) return "";

    if (number >= 15) {

        return "sla-danger";

    }

    if (number >= 5) {

        return "sla-warning";

    }

    return "sla-good";

}

export function truncate(text, max = 90) {

    if (!text) return "-";

    if (text.length <= max) return text;

    return text.substring(0, max) + "...";

}

export function initials(name = "") {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((x) => x[0])
        .join("")
        .toUpperCase();

}

export function isClosed(ticket) {

    return ticket?.status === "CLOSED";

}

export function isOpen(ticket) {

    return ticket?.status === "OPEN";

}

export function isProcess(ticket) {

    return ticket?.status === "PROCESS";

}
export function formatDuration(totalMinutes = 0) {

    const minutes = Number(totalMinutes);

    if (!Number.isFinite(minutes) || minutes < 0) {
        return "-";
    }

    if (minutes === 0) {
        return "0 Menit";
    }

    if (minutes < 60) {
        return `${minutes} Menit`;
    }

    if (minutes < 1440) {
        return `${Math.floor(minutes / 60)} Jam`;
    }

    return `${Math.floor(minutes / 1440)} Hari`;

}