const Database = require('better-sqlite3');
const Logger = require('../logger');

class SQLite {
    constructor(path) {
        const db = new Database(path);
        this.db = db;
        Logger.debug('Connected to database: ' + path);
    }
}

module.exports = SQLite;