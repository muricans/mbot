const Database = require('better-sqlite3');
const Logger = require('../logger');

/**
 * better-sqlite3 Database wrapper.
 */
class SQLite {
    /**
     * Creates an better-sqlite3 database with extra utils.
     * Database can be accessed with #db
     * To access the SQLite utils within #db using #db#sqlite
     * 
     * @param {string} path Location of sqlite database to be loaded or created.
     */
    constructor(path) {
        const db = new Database(path);
        this.db = db;
        this.db.sqlite = this;
        Logger.debug('Connected to database: ' + path);
    }

    /**
     * 
     * @param {string} into 
     * @param {any[]} values 
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

    rowExists(select, from, where) {
        return new Promise(resolve => {
            process.nextTick(async () => {
                const row = await this.get(`SELECT ${select} FROM ${from} ${where}`);
                if (row === undefined) return resolve(false);
                else return resolve(true);
            });
        });
    }

    get(stmnt) {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                try {
                    const g = this.db.prepare(stmnt).get();
                    resolve(g);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
}

module.exports = SQLite;