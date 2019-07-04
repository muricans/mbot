const Database = require('better-sqlite3');
const Logger = require('../logger');

class SQLite {
    constructor(path) {
        const db = new Database(path);
        this.db = db;
        this.db.sqlite = this;
        Logger.debug('Connected to database: ' + path);
    }

    /**
     * 
     * @param {string} into 
     * @param {*[]} values 
     * @param {boolean} [ignore] 
     */
    insert(into, values, ignore) {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                let q = [];
                values.forEach(() => {
                    q.push('?');
                });
                q = q.join(', ');
                try {
                    if (ignore === true) {
                        this.db.prepare(`INSERT OR IGNORE INTO ${into} VALUES(${q})`).run(values);
                        resolve();
                    } else {
                        this.db.prepare(`INSERT INTO ${into} VALUES(${q})`).run(values);
                        resolve();
                    }
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    /**
     * 
     * @param {string} from 
     * @param {string} [where] 
     */
    delete(from, where) {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                try {
                    if (where !== null) {
                        this.db.prepare(`DELETE FROM ${from} WHERE ${where}`).run();
                        resolve();
                    } else {
                        this.db.prepare(`DELETE * FROM ${from}`).run();
                        resolve();
                    }
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    each(select, from, callback) {
        process.nextTick(() => {
            try {
                this.db.prepare(`SELECT ${select} FROM ${from}`).all().forEach(row => callback(null, row));
            } catch (err) {
                callback(err);
            }
        });
    }
}

module.exports = SQLite;