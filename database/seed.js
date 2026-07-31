const db = require("./database");

function seedOperationalRotation() {

    const total = db.prepare(`
        SELECT COUNT(*) AS total
        FROM operational_rotation
    `).get();

    if (total.total > 0) {

        console.log("✓ operational_rotation already seeded");

        return;

    }

    const insert = db.prepare(`
        INSERT INTO operational_rotation (

            year,
            month,
            primary_team,
            backup_team,
            updated_by,
            updated_at

        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {

        let primaryTeam = "TEAM_A";

        for (let year = 2026; year <= 2027; year++) {

            const startMonth = year === 2026 ? 7 : 1;

            for (let month = startMonth; month <= 12; month++) {

                const backupTeam =
                    primaryTeam === "TEAM_A"
                        ? "TEAM_B"
                        : "TEAM_A";

                insert.run(
                    year,
                    month,
                    primaryTeam,
                    backupTeam,
                    "SYSTEM",
                    null
                );

                primaryTeam = backupTeam;

            }

        }

    });

    transaction();

    console.log("✅ operational_rotation seeded");

}

function runSeeds() {

    seedOperationalRotation();

}

module.exports = {
    runSeeds
};