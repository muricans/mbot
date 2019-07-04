const fs = require('fs');
const settings = require('./settings.json');
const chalk = require('chalk');

const mbotLogStream = fs.createWriteStream('logs/mbot.log');
const isFileLogging = settings.fileLogging;

/**
 * Used to have more detailed logging.
 * @example
 * const Logger = require('./logger');
 * Logger.info('Connected to logger!');
 */
class Logger {
    /**
     * Use debug tag when logging to console.
     * 
     * @param {string} text The text you want to send to console.
     */
    static debug(text) {
        if (settings.debug) {
            return rawLog(text, 'DEBUG');
        }
    }

    /**
     * Use file tag when logging to console.
     * 
     * @param {string} text The text you want to send to console.
     */
    static file(text) {
        return rawLog(text, 'FILE');
    }

    /**
     * Use info tag when logging to console.
     * 
     * @param {string} text The text you want to send to console.
     */
    static info(text) {
        return rawLog(text, 'INFO');
    }

    /**
     * Use error tag when logging to console.
     * 
     * @param {string} text The text you want to send to console.
     */
    static error(text) {
        return rawLog(text, 'ERROR');
    }

    /**
     * Use warn tag when logging to console.
     * 
     * @param {string} text The text you want to send to console.
     */
    static warn(text) {
        return rawLog(text, 'WARN');
    }

    /**
     * Use no tag when logging to console. 
     * 
     * @param {string} text The text you want to send to console.
     */
    static log(text) {
        return new Promise(resolve => {
            process.nextTick(() => {
                console.log(`[${time()}]: ${text}`);
                resolve();
            });
        });
    }
}

function rawLog(message, type) {
    return new Promise(resolve => {
        process.nextTick(() => {
            const open = chalk.yellow('[');
            const close = chalk.yellow(']');
            type = chalk.blue('LEVEL-' + type);
            console.log(`${open}${chalk.green(time())} ${type}${close}: ${message}`);
            if (isFileLogging) {
                mbotLogStream.write(writeLog(message, type));
            }
            resolve();
        });
    });
}

function writeLog(message, type) {
    return `[${time()} LEVEL-${type}]: ${message}\n`;
}

function time() {
    const date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return `${hour}:${min}:${sec}`;
}

module.exports = Logger;