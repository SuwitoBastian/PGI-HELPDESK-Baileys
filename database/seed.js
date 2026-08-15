const db = require("./database");

/* ==========================================================
   Operational Rotation
========================================================== */

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

/* ==========================================================
   Engineers
========================================================== */

function seedEngineers() {

    const total = db.prepare(`
        SELECT COUNT(*) AS total
        FROM engineers
    `).get();

    if (total.total > 0) {

        console.log("✓ engineers already seeded");

        return;

    }

    const insert = db.prepare(`
        INSERT INTO engineers (

            code,
            name,
            whatsapp,
            team,
            role,
            aktif

        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const engineers = [

        // TEAM_A (Primary Saat Ini)

        ["SW", "Suwito",  null, "TEAM_A", "MEMBER", 1],
        ["RP", "Rifaldo", null, "TEAM_A", "MEMBER", 1],
        ["IW", "Iwan",    null, "TEAM_A", "MEMBER", 1],

        // TEAM_B (Backup Saat Ini)

        ["GL", "Galih",   null, "TEAM_B", "MEMBER", 1],
        ["KA", "Andi",    null, "TEAM_B", "MEMBER", 1],
        ["HL", "Hilmi",   null, "TEAM_B", "MEMBER", 1]

    ];

    const transaction = db.transaction(() => {

        for (const engineer of engineers) {

            insert.run(...engineer);

        }

    });

    transaction();

    console.log("✅ engineers seeded");

}

/* ==========================================================
   Run All Seeds
========================================================== */

function runSeeds() {

    seedOperationalRotation();

    seedEngineers();

}

module.exports = {
    runSeeds
};