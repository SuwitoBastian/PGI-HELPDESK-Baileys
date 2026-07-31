const Database = require('better-sqlite3');
const config = require('../config');
const path = require('path');

console.log('DATABASE PATH :', path.resolve(config.DATABASE));

const db = new Database(config.DATABASE);

db.pragma('journal_mode = WAL');

module.exports = db;