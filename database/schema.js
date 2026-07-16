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

    assignment_group TEXT

    open_reminder_sent INTEGER DEFAULT 0
    

)
`

];