const db = require("./database");

const schema = require("./schema");

const migration = require("./migrations");

const seed = require("./seed");

function migrate() {

    console.log("🚀 Running database migration...");

    /* ==========================
       Create Tables
    ========================== */

    schema.forEach((sql, index) => {

        try {

            db.exec(sql);

        } catch (err) {

            console.error(
                `❌ Failed to execute schema #${index + 1}`
            );

            throw err;

        }

    });

    /* ==========================
       Tickets
    ========================== */

    migration.addColumn(
        "tickets",
        "pic_selesai",
        "TEXT"
    );

    migration.addColumn(
        "tickets",
        "open_reminder_sent",
        "INTEGER DEFAULT 0"
    );

    /* ==========================
       SLA Phase 3.1
    ========================== */

    migration.addColumn(
        "tickets",
        "assigned_at",
        "TEXT"
    );

    migration.addColumn(
        "tickets",
        "sla_status",
        "TEXT DEFAULT 'NORMAL'"
    );

    /* ==========================
       Enterprise Phase 2
    ========================== */

    migration.addColumn(
        "tickets",
        "engineer_team",
        "TEXT"
    );

    /* ==========================
       Enterprise Phase 2.1
    ========================== */

    migration.addColumn(
        "tickets",
        "pic_team",
        "TEXT"
    );

    migration.addColumn(
        "tickets",
        "pic_selesai_team",
        "TEXT"
    );

    /* ==========================
       Customer Feedback
    ========================== */

    migration.addColumn(
        "tickets",
        "feedback_sent",
        "INTEGER DEFAULT 0"
    );

    migration.addColumn(
        "tickets",
        "feedback_sent_at",
        "TEXT"
    );

    /* ==========================
       Operational Rotation
    ========================== */

    migration.addColumn(
        "operational_rotation",
        "backup_team",
        "TEXT DEFAULT 'TEAM_B'"
    );

    migration.addColumn(
        "operational_rotation",
        "updated_by",
        "TEXT"
    );

    migration.addColumn(
        "operational_rotation",
        "updated_at",
        "TEXT"
    );

    /* ==========================
       Seed Default Data
    ========================== */

    seed.runSeeds();

    console.log("✅ Database migration completed.");

}
if (require.main === module) {
    migrate();
}

module.exports = migrate;