const sqlite = require('sqlite3').verbose();
const Logger = require('../logger');

class SQLite {
    constructor(path) {
        const db = new sqlite.Database(path, (err => {
            if (err) return console.log(err.message);
            Logger.info('Connected to ' + path + ' database');
        }));
        this.db = db;
    }
}

module.exports = SQLite;