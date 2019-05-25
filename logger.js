const fs = require('fs');
const settings = require('./settings.json');

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
            rawLog(text, 'DEBUG');
        }
    }

    /**
     * Use file tag when logging to console.
     * 
     * @param {string} text The text you want to send to console.
     */
    static file(text) {
        rawLog(text, 'FILE');
    }

    /**
     * Use info tag when logging to console.
     * 
     * @param {string} text The text you want to send to console.
     */
    static info(text) {
        rawLog(text, 'INFO');
    }

    /**
     * Use error tag when logging to console.
     * 
     * @param {string} text The text you want to send to console.
     */
    static error(text) {
        rawLog(text, 'ERROR');
    }

    /**
     * Use warn tag when logging to console.
     * 
     * @param {string} text The text you want to send to console.
     */
    static warn(text) {
        rawLog(text, 'WARN');
    }

    /**
     * Use no tag when logging to console. 
     * 
     * @param {string} text The text you want to send to console.
     */
    static log(text) {
        console.log(`[${time()}]: ${text}`);
    }
}

function rawLog(message, type) {
    console.log(`[${time()} LEVEL-${type}]: ${message}`);
    if (isFileLogging) {
        mbotLogStream.write(writeLog(message, type));
    }
}

function writeLog(message, type) {
    return `[${time()} LEVEL-${type}]: ${message}\n`;
}

function time() {
    let date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return `${hour}:${min}:${sec}`;
}

module.exports = Logger;