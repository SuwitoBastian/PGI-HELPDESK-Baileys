const engineerAnalytics =
    require("./engineerAnalytics");

const teamStatus =
    require("./teamStatus");

const repository =
    require("../../repositories/ticketRepository");

const feedbackRepository =
    require("../../repositories/feedbackRepository");

function getTeams(
    start = null,
    end = null,
    teamFilter = null
) {

    const engineerStats =
        engineerAnalytics.getEngineers(
            start,
            end,
            teamFilter
        );

    const teams = {

        TEAM_A: {

            id: "TEAM_A",

            name: "Team A",

            engineers: []

        },

        TEAM_B: {

            id: "TEAM_B",

            name: "Team B",

            engineers: []

        }

    };

    // ==========================================
    // Kelompokkan engineer berdasarkan team
    // ==========================================
    engineerStats.forEach(engineer => {

        const team =
            teams[engineer.team];

        if (team) {

            team.engineers.push(
                engineer
            );

        }

    });

    // ==========================================
    // Hitung statistik setiap team
    // ==========================================
    Object.values(teams).forEach(team => {

        team.assigned =
            team.engineers.reduce(
                (sum, engineer) => sum + engineer.assigned,
                0
            );

        team.completed =
            team.engineers.reduce(
                (sum, engineer) => sum + engineer.completed,
                0
            );

        team.process =
            team.engineers.reduce(
                (sum, engineer) => sum + engineer.process,
                0
            );

        let completionRate = 0;

        if (team.assigned > 0) {

            completionRate = Math.round(
                (team.completed / team.assigned) * 100
            );

            completionRate = Math.min(
                completionRate,
                100
            );

        }

        team.completionRate =
            completionRate;

        team.workload =
            team.process;

        // ==========================================
        // Team Overview
        // ==========================================

        const totalEngineer =
            team.engineers.length;

        const avgTicketPerEngineer =
            totalEngineer > 0
                ? Number(
                    (
                        team.assigned /
                        totalEngineer
                    ).toFixed(1)
                )
                : 0;

        const feedbackStatistics =
            feedbackRepository.getStatistics({

                startDate: start,

                endDate: end,

                team: team.id

            });

        const branchHandled =
            repository.countBranchHandled(

                team.id,

                start,

                end

            );

        team.overview = {

            totalEngineer,

            avgTicketPerEngineer,

            waitingFeedback:
                feedbackStatistics.waiting_feedback,

            branchHandled

        };

        const status =
            teamStatus.getStatus(

                team.assigned,

                team.completionRate

            );

        team.status =
            status.label;

        team.color =
            status.color;

    });

    return Object.values(teams);

}

module.exports = {

    getTeams

};