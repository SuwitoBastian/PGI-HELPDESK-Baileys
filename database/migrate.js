const db = require('./database');

const schema = require('./schema');

const migration =
require('./migrations');

function migrate(){

    schema.forEach(sql=>{

        db.prepare(sql).run();

    });

    migration.addColumn(
        'tickets',
        'pic_selesai',
        'TEXT'
    );

    migration.addColumn(
        'tickets',
        'open_reminder_sent',
        'INTEGER DEFAULT 0'
    );

    console.log(
        "✅ Database Ready"
    );

}

module.exports = migrate;