const repository =
    require("../../repositories/ticketRepository");

const slaService =
    require("../slaService");

async function getOverview(start, end, team = null) {

    const byDate =
        !!(start && end);

    const overview = {

        today: byDate
            ? repository.countOpenByDate(start, end, team)
            + repository.countProcessByDate(start, end, team)
            + repository.countClosedByDate(start, end, team)
            : repository.countToday(team),

        open: byDate
            ? repository.countOpenByDate(start, end, team)
            : repository.countOpen(team),

        process: byDate
            ? repository.countProcessByDate(start, end, team)
            : repository.countProcess(team),

        closed: byDate
            ? repository.countClosedByDate(start, end, team)
            : repository.countClosed(team)

    };

    const sla =
        slaService.getSLAMetrics(
            start,
            end,
            team
        );

    return {

        ...overview,

        sla

    };

}

module.exports = {

    getOverview

};