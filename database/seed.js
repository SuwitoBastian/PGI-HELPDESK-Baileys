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
   Helpdesk Groups
========================================================== */

function seedHelpdeskGroups() {

    const groups = [

        [
            "IT-AM Faiz",
            "120363407392228654@g.us",
            1
        ],

        [
            "IT-AM Indah",
            "120363403420498048@g.us",
            0
        ],

        [
            "IT-AM Deliviani",
            "120363408078086135@g.us",
            1
        ],

        [
            "IT-AM Naya",
            "120363426146761749@g.us",
            1
        ],

        [
            "IT-AM Fathur",
            "120363405503402810@g.us",
            1
        ],

        [
            "IT-AM Amantha",
            "120363422562446752@g.us",
            1
        ],

    ];

    const insert = db.prepare(`
        INSERT OR IGNORE INTO helpdesk_groups (
            group_name,
            group_id,
            enabled
        )
        VALUES (?, ?, ?)
    `);

    const transaction = db.transaction(() => {

        for (const group of groups) {

            insert.run(...group);

        }

    });

    transaction();

    console.log("âœ… helpdesk_groups seeded");

}

/* ==========================================================
   Run All Seeds
========================================================== */

function runSeeds() {

    seedOperationalRotation();

    seedEngineers();

    seedHelpdeskGroups();

}

module.exports = {
    runSeeds
};