const repository =
    require("../../repositories/ticketRepository");

const engineers =
    require("../../config/engineers");

const metrics =
    require("./metrics");

const contributionCalculator =
    require("./calculators/contributionCalculator");

const capacityCalculator =
    require("./calculators/capacityCalculator");

const scoreCalculator =
    require("./calculators/scoreCalculator");

function getEngineers(
    start = null,
    end = null,
    team = null
) {

    const engineerList = Object.values(engineers).filter(engineer => {
        return !team || engineer.team === team;
    });

    const data = engineerList.map(engineer => {

        const assigned =
            metrics.assignment.build(
                engineer,
                repository,
                start,
                end,
                team
            );

        const completed =
            metrics.completion.build(
                engineer,
                repository,
                start,
                end,
                team
            );

        const process =
            metrics.workload.build(
                engineer,
                repository,
                start,
                end,
                team
            );

        return {

            code: engineer.code,

            name: engineer.name,

            team: engineer.team,

            assigned,

            completed,

            process

        };

    });

    const totalCompleted =
        data.reduce(
            (sum, engineer) => sum + engineer.completed,
            0
        );

    data.forEach(engineer => {

        engineer.contribution =
            contributionCalculator.calculate(
                engineer.completed,
                totalCompleted
            );

        engineer.capacity =
            capacityCalculator.calculate(
                engineer.process
            );

        engineer.score =
            scoreCalculator.calculate(
                engineer
            );

    });

    data.sort(
        (a, b) => b.score - a.score
    );

    return data;

}

module.exports = {

    getEngineers

};