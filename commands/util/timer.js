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
    usage: `<time?'min','hour'|cancel|list> [name]`,
    description: 'Set a timer for the bot to remind you on when it completes.',
    args: true,
    minArgs: 1,
    execute(message, args) {
        if (args[0].toLowerCase() === "cancel") {
            const user = this.users.get(message.author.id);
            if (!user) {
                return message.channel.send(`You don't have any timers set up right now!`);
            }
            if (!args[1]) {
                return message.channel.send(`${message.author} Please provide your timers name!`);
            }
            const timerName = args.slice(1, args.length).join(' ');
            const timerId = user.get('names').get(timerName);
            if (!timerId) {
                return message.channel.send('Could not find a timer by that name!');
            }
            tools.deleteTimer(message.author.id, timerId, timerName);
            return message.channel.send(`${message.author} Timer ${timerName} deleted successfully!`);
        } else if (args[0].toLowerCase() === "list") {
            const user = this.users.get(message.author.id);
            const names = user.get('names').array();
            const ids = user.get('ids');
            let send = [];
            for (let i = 0; i < names.length; i++) {
                const exp = user.get('dates').get(names[i]) + user.get('timers').get(names[i]);
                const left = (exp - Date.now()) / 1000;
                let timeLeft = Math.floor(left);
                if (timeLeft >= 3600) {
                    const mins = Math.floor((left / 60) % 60);
                    timeLeft = Math.floor(timeLeft / 3600);
                    timeLeft += ` hours and ${mins} minutes`;
                } else if (timeLeft >= 60) {
                    const secs = Math.floor(left % 60);
                    timeLeft = Math.floor(timeLeft / 60);
                    timeLeft += ` minutes and ${secs} seconds`;
                }
                send.push(`${ids.get(names[i])} - ${timeLeft}`);
            }
            send = send.join('\n');
            if (send !== '') {
                return message.channel.send(send).catch();
            } else {
                return message.channel.send(`${message.author} Could not find any timers!`);
            }
        }
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
        const timerId = crypto.createHash('md5').update(wordNumbers).digest('hex');
        const timerName = name === '' ? 'No name provided' : name;
        if (this.users.get(message.author.id).get('names').has(timerName)) {
            return message.channel.send('A timer with that name already exists!');
        }
        require('../../logger').debug(wordNumbers);
        tools.createTimer(message.author.id, mil, timerId, timerName);
        return message.channel.send(`${message.author} Successfully created timer that will go off in ${out}\nName: ${timerName}`);
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