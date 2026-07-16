const db = require('./database');

function hasColumn(table, column) {

    const columns =
        db.prepare(
            `PRAGMA table_info(${table})`
        ).all();

    return columns.some(
        c => c.name === column
    );

}

function addColumn(table, column, type){

    if(
        hasColumn(table,column)
    )
        return;

    db.prepare(
        `ALTER TABLE ${table}
        ADD COLUMN ${column} ${type}`
    ).run();

    console.log(
        `✅ Column ${column} added`
    );

}

module.exports = {

    addColumn

};