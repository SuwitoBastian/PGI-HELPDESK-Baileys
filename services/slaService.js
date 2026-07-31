const repository = require("../repositories/ticketRepository");

const {
    responseTime,
    resolutionTime,
    totalDuration
} = require("../utils/slaHelper");

function average(values) {

    if (!values.length) {
        return 0;
    }

    const total = values.reduce(
        (sum, value) => sum + value,
        0
    );

    return Math.round(total / values.length);

}

function getSLAMetrics(start, end, team = null) {

    const tickets =
        repository.findClosedForSLA(
            start,
            end,
            team
        );

    const responseTimes = [];
    const resolutionTimes = [];
    const totalDurations = [];

    for (const ticket of tickets) {

        responseTimes.push(
            responseTime(ticket)
        );

        totalDurations.push(
            totalDuration(ticket)
        );

        // Resolution hanya dihitung jika SLA tidak expired
        if (ticket.sla_status === "NORMAL") {

            resolutionTimes.push(
                resolutionTime(ticket)
            );

        }

    }

    return {

        totalTicket: tickets.length,

        averageResponseTime:
            average(responseTimes),

        averageResolutionTime:
            average(resolutionTimes),

        averageTotalDuration:
            average(totalDurations),

        normalSLA:
            tickets.filter(
                t => t.sla_status === "NORMAL"
            ).length,

        expiredSLA:
            tickets.filter(
                t => t.sla_status === "EXPIRED"
            ).length

    };

}

module.exports = {

    getSLAMetrics

};