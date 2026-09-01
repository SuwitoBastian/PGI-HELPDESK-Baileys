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
`,

`
CREATE TABLE IF NOT EXISTS engineers (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    code TEXT NOT NULL UNIQUE,

    name TEXT NOT NULL,

    whatsapp TEXT,

    team TEXT NOT NULL
        CHECK(team IN ('TEAM_A','TEAM_B')),

    role TEXT NOT NULL
        DEFAULT 'MEMBER'
        CHECK(role IN ('LEADER','MEMBER')),

    aktif INTEGER NOT NULL
        DEFAULT 1,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP

)
`,

`
CREATE TABLE IF NOT EXISTS operational_assignment (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    rotation_id INTEGER NOT NULL,

    engineer_code TEXT NOT NULL,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(rotation_id)
        REFERENCES operational_rotation(id)
        ON DELETE CASCADE,

    FOREIGN KEY(engineer_code)
        REFERENCES engineers(code)
        ON DELETE CASCADE,

    UNIQUE(rotation_id, engineer_code)

)
`,

`
CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    name TEXT NOT NULL,

    aktif INTEGER NOT NULL DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`,

`
CREATE TABLE IF NOT EXISTS knowledge_base (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,

    slug TEXT NOT NULL UNIQUE,

    category TEXT NOT NULL,

    content TEXT NOT NULL,

    keywords TEXT,

    status TEXT NOT NULL
        DEFAULT 'DRAFT'
        CHECK(status IN ('DRAFT', 'PUBLISHED')),

    views INTEGER NOT NULL
        DEFAULT 0,

    created_by INTEGER,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(created_by)
        REFERENCES users(id)
        ON DELETE SET NULL

)
`

];