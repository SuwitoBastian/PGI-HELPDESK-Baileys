/**
 * Menghitung selisih menit antara dua timestamp.
 * Return 0 jika data tidak valid.
 */
function diffMinutes(start, end) {

    if (!start || !end) {
        return 0;
    }

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (isNaN(startTime) || isNaN(endTime)) {
        return 0;
    }

    return Math.max(
        0,
        Math.floor((endTime - startTime) / 60000)
    );

}

/**
 * Response Time
 * OPEN -> PROCESS
 */
function responseTime(ticket) {

    return diffMinutes(
        ticket.waktu,
        ticket.assigned_at
    );

}

/**
 * Resolution Time
 * PROCESS -> CLOSED
 */
function resolutionTime(ticket) {

    return diffMinutes(
        ticket.assigned_at,
        ticket.selesai
    );

}

/**
 * Total Duration
 * OPEN -> CLOSED
 */
function totalDuration(ticket) {

    return diffMinutes(
        ticket.waktu,
        ticket.selesai
    );

}

module.exports = {

    diffMinutes,

    responseTime,

    resolutionTime,

    totalDuration

};