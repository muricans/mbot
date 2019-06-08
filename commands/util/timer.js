const Discord = require('discord.js');
const tls = require('../../tools');
const tools = new tls.Tools();
const crypto = require('crypto');
const words = require('../../words.json');
const {
    bot_owners_id,
} = require('../../settings.json');

const minAlias = ['min', 'minute', 'm', 'minutes', 'mins'];
const hourAlias = ['hour', 'hours', 'h', 'hr', 'hrs'];

module.exports = {
    users: new Discord.Collection(),
    name: 'timer',
    usage: `<time?'min','hour'|cancel|list> [name]`,
    description: 'Set a timer for the bot to remind you on when it completes.',
    args: true,
    minArgs: 1,
    execute(message, args) {
        if (args[0].toLowerCase() === "cancel") {
            const user = this.users.get(message.author.id);
            if (!args[1]) {
                return message.channel.send(`${message.author} Please provide your timers name!`);
            }
            const timerName = args.slice(1, args.length).join(' ');
            const timerId = user.get('names').get(timerName.toLowerCase());
            if (!timerId) {
                const ids = user.get('names').array();
                if (!ids.length) {
                    return message.channel.send(`You don't have any timers set up right now!`);
                }
                for (let i = 0; i < ids.length; i++) {
                    if (ids[i].substr(0, 6) === timerName) {
                        const name = user.get('ids').get(ids[i]);
                        tools.deleteTimer(message.author.id, ids[i], name);
                        return message.channel.send(`${message.author} Timer ${name} (${timerName}) canceled successfully!`);
                    } else {
                        return message.channel.send('No timers were found with that name or id!');
                    }
                }
            }
            tools.deleteTimer(message.author.id, timerId, timerName);
            return message.channel.send(`${message.author} Timer ${timerName} cancled successfully!`);
        } else if (args[0].toLowerCase() === "list") {
            const user = this.users.get(message.author.id);
            const names = user.get('names').array();
            let send = [];
            for (let i = 0; i < names.length; i++) {
                const id = user.get('ids').get(names[i]);
                const exp = user.get('dates').get(names[i]) + user.get('timers').get(names[i]);
                const left = (exp - Date.now()) / 1000;
                let timeLeft = Math.floor(left);
                if (timeLeft >= 3600) {
                    const mins = Math.floor((left / 60) % 60);
                    timeLeft = Math.floor(timeLeft / 3600);
                    timeLeft += ` hour(s) and ${mins} minute(s)`;
                } else if (timeLeft >= 60) {
                    const secs = Math.floor(left % 60);
                    timeLeft = Math.floor(timeLeft / 60);
                    timeLeft += ` minute(s) and ${secs} second(s)`;
                } else {
                    timeLeft += ` second(s)`;
                }
                const shortId = user.get('shortIds').get(id);
                send.push(`${id} (${shortId}) - ${timeLeft}`);
            }
            send = send.join('\n');
            tools.addCooldown(this.name, 3, message);
            if (send !== '') {
                return message.channel.send('Timers:\n' + send).catch();
            } else {
                return message.channel.send(`${message.author} Could not find any timers!`);
            }
        }
        if (!this.users.has(message.author.id)) {
            this.users.set(message.author.id, new Discord.Collection());
        }
        for (let i = 0; i < bot_owners_id.length; i++) {
            if (this.users.get(message.author.id).get('timers').array().length === 3 && message.author.id !== bot_owners_id[i]) {
                return message.channel.send(`${message.author} You have reached the maximum number of timers that can be created!`);
            }
        }
        const time = parseInt(args[0]);
        if (isNaN(time)) {
            return message.channel.send(`${message.author} Please use numbers!`);
        }
        const timeArray = args[0].split(':');
        let out = "Error occured";
        let mil = tools.parseTime(args[0]);
        if (timeArray.length <= 1) {
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
                } else if (sec >= 3600) {
                    out = `${Math.floor(sec / 3600)} hour(s)`;
                } else {
                    out = `${sec} second(s)`;
                }
            }
        } else {
            if (timeArray.length < 3 || timeArray.length > 3) {
                return message.channel.send(`${message.author} Please follow the time format! hh:mm:ss`);
            }
            const hours = tools.parseTime(timeArray[0] + 'hour');
            const minutes = tools.parseTime(timeArray[1] + 'min');
            const seconds = tools.parseTime(timeArray[2]);
            mil = hours + minutes + seconds;
            out = `${timeArray[0]}:${timeArray[1]}:${timeArray[2]}`;
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
        const timerId = crypto.createHash('md5').update(wordNumbers).digest('hex');
        const timerName = name === '' ? 'no name provided' : name;
        if (this.users.get(message.author.id).get('names').has(timerName)) {
            return message.channel.send('A timer with that name already exists!');
        }
        require('../../logger').debug(wordNumbers);
        tools.createTimer(message.author.id, mil, timerId, timerName.toLowerCase());
        tools.addCooldown(this.name, 5, message);
        return message.channel.send(`${message.author} Successfully created timer that will go off in ${out}\nName: ${timerName} (${timerId.substr(0, 6)})`);
    },
};

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