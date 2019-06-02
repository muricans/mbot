const Discord = require('discord.js');
const tls = require('../../tools');
const tools = new tls.Tools();
const crypto = require('crypto');
const words = require('../../words.json');

const minAlias = ['min', 'minute', 'm', 'minutes', 'mins'];
const hourAlias = ['hour', 'hours', 'h', 'hr', 'hrs'];

module.exports = {
    users: new Discord.Collection(),
    name: 'timer',
    usage: `<time?'min','hour'> [name]`,
    description: 'Set a timer for the bot to remind you on when it completes.',
    args: true,
    minArgs: 1,
    execute(message, args) {
        if (!this.users.has(message.author.id)) {
            this.users.set(message.author.id, new Discord.Collection());
        }
        const time = parseInt(args[0]);
        if (!time) {
            return message.channel.send(`${message.author} Please use numbers!`);
        }
        let out = "Error occured";
        const mil = tools.parseTime(args[0]);
        if (hasMin(args[0]) && !hasHour(args[0])) {
            const minutes = parseInt(args[0]);
            if (minutes >= 60) {
                out = `${Math.floor(minutes / 60)} hour(s)`;
            } else {
                out = `${minutes} minute(s)`;
            }
        } else if (hasHour(args[0]) && !hasMin(args[0])) {
            out = `${parseInt(args[0])} hour(s)`;
        } else {
            const sec = parseInt(args[0]);
            if (sec >= 60) {
                out = `${Math.floor(sec / 60)} minute(s)`;
            } else {
                out = `${sec} second(s)`;
            }
        }
        let wordNumbers = 'timer:';
        wordNumbers += Math.floor(Math.random() * 15231).toString();
        wordNumbers += Math.random() * 10;
        wordNumbers += Math.floor(Math.random() * 103145).toString();
        wordNumbers += words[Math.floor(Math.random() * words.length)];
        const name = args.slice(1, args.length).join(' ');
        if (args[1] !== null) {
            wordNumbers += name.split(' ').join('_');
        }
        console.log(wordNumbers);
        const timerId = crypto.createHash('md5').update(wordNumbers).digest('hex');
        timerName = name === '' ? 'No name provided' : name;
        tools.createTimer(message.author.id, mil, timerId, timerName);
        return message.channel.send(`${message.author} Successfully created timer that will go off in ${out}\nName: ${timerName}`);
    }
}

function hasMin(string) {
    let contains = false;
    for (const i in minAlias) {
        if (string.includes(minAlias[i])) contains = true;
    }
    return contains;
}

function hasHour(string) {
    let contains = false;
    for (const i in hourAlias) {
        if (string.includes(hourAlias[i])) contains = true;
    }
    return contains;
}