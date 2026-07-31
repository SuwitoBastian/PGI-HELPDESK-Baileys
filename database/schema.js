module.exports = [

`
CREATE TABLE IF NOT EXISTS tickets (

    id TEXT PRIMARY KEY,

    nama TEXT,

    nomor TEXT,

    chatId TEXT,

    cabang TEXT,

    kendala TEXT,

    waktu TEXT,

    selesai TEXT,

    durasi TEXT,

    status TEXT,

    pic TEXT,

    pic_selesai TEXT,

    waiting_pic INTEGER,

    assignment_group TEXT,

    open_reminder_sent INTEGER DEFAULT 0,

    assigned_at TEXT,

    sla_status TEXT DEFAULT 'NORMAL',

    engineer_team TEXT,

    pic_team TEXT,

    pic_selesai_team TEXT,

    feedback_sent INTEGER DEFAULT 0,

    feedback_sent_at TEXT

)
`,

`
CREATE TABLE IF NOT EXISTS operational_rotation (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    year INTEGER NOT NULL,

    month INTEGER NOT NULL
        CHECK(month BETWEEN 1 AND 12),

    primary_team TEXT NOT NULL
        CHECK(primary_team IN ('TEAM_A', 'TEAM_B')),

    backup_team TEXT NOT NULL
        CHECK(backup_team IN ('TEAM_A', 'TEAM_B')),

    updated_by TEXT,

    updated_at TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(year, month)

)
`,

`
CREATE TABLE IF NOT EXISTS feedback (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    ticket_id TEXT,

    branch TEXT,

    issue_category TEXT,

    engineer TEXT,

    response_rating INTEGER NOT NULL
        CHECK(response_rating BETWEEN 1 AND 5),

    solution_rating INTEGER NOT NULL
        CHECK(solution_rating BETWEEN 1 AND 5),

    comment TEXT,

    feedback_at TEXT NOT NULL,

    source TEXT NOT NULL DEFAULT 'GOOGLE_FORM',

    FOREIGN KEY(ticket_id)
        REFERENCES tickets(id)
        ON DELETE SET NULL

)
`

];