const Discord = require('discord.js');

module.exports = {
    guilds: new Discord.Collection(),
    mutes: new Discord.Collection(),
    timeouts: new Discord.Collection(),
    name: 'mute',
    usage: `<user> <time?'min','hour'>`,
    description: 'Keeps a player from chatting for specified time.',
    args: true,
    minArgs: 2,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     * @param {*} client 
     */
    execute(message, args, client) {
        const canKick = message.channel.permissionsFor(message.member).has("KICK_MEMBERS");
        if (!canKick) {
            return message.channel.send(`${message.author} You do not have permission to use this command!`);
        }
        if (!this.guilds.has(message.guild.id)) {
            this.guilds.set(message.guild.id, new Discord.Collection());
        }
        const mention = message.mentions.users.first();
        if (!mention) {
            return message.channel.send(`${message.author} Could not find that user!`);
        }
        const time = parseInt(args[1]);
        if (!time) {
            return message.channel.send(`${message.author} Please use numbers!`);
        }
        const muted = this.guilds.get(message.guild.id);
        if (muted.has(mention.id)) {
            return message.channel.send(`${message.author} That user is already muted!`);
        }
        if (mention.id === client.user.id) {
            return message.channel.send(`${message.author} You cannot mute the bot!`);
        }
        const isAdmin = message.channel.permissionsFor(message.guild.member(mention)).has("ADMINISTRATOR");
        const admin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
        if (isAdmin && !admin) {
            return message.channel.send(`${message.author} You don't have permission to mute that user!`);
        }
        const mRole = message.guild.member(mention).highestRole;
        const role = message.member.highestRole;
        if (mRole.comparePositionTo(role) > 0 || mRole.position === role.position) {
            return message.channel.send(`${message.author} That user has a higher role than you!`);
        }
        let out = "Error occured";
        const mil = parseTime(args[1]);
        if (hasMin(args[1]) && !hasHour(args[1])) {
            const minutes = parseInt(args[1]);
            if (minutes >= 60) {
                out = `${Math.floor(minutes / 60)} hour(s)`;
            } else {
                out = `${minutes} minute(s)`;
            }
        } else if (hasHour(args[1]) && !hasMin(args[1])) {
            out = `${parseInt(args[1])} hour(s)`;
        } else {
            const sec = parseInt(args[1]);
            if (sec >= 60) {
                out = `${Math.floor(sec / 60)} minute(s)`;
            } else {
                out = `${sec} seconds`;
            }
        }
        muteMember(muted, mention.id, mil);
        return message.channel.send(`${message.author} muted ${mention} for ${out}!`);
    },
}

function muteMember(muted, id, mil) {
    module.exports.mutes.set(id, Date.now());
    muted.set(id, mil);
    const timeout = setTimeout(() => {
        muted.delete(id);
        module.exports.mutes.delete(id);
        module.exports.timeouts.delete(id);
    }, mil);
    module.exports.timeouts.set(id, timeout);
    timeout;
}

const minAlias = ['min', 'minute', 'm', 'minutes', 'mins'];
const hourAlias = ['hour', 'hours', 'h', 'hr', 'hrs'];

function hasMin(string) {
    let contains = false;
    for (let i in minAlias) {
        if (string.includes(minAlias[i])) contains = true;
    }
    return contains;
}

function hasHour(string) {
    let contains = false;
    for (let i in hourAlias) {
        if (string.includes(hourAlias[i])) contains = true;
    }
    return contains;
}

function parseTime(object) {
    let isHour = false;
    let isMinute = false;
    for (let i in hourAlias) {
        if (object.includes(hourAlias[i])) {
            isHour = true;
        } else {
            for (let i2 in minAlias) {
                if (object.includes(minAlias[i2]) && !object.includes(hourAlias[i])) isMinute = true;
            }
        }
    }
    if (isMinute) {
        const minutes = parseInt(object);
        const sec = (minutes * 60);
        const mil = (sec * 1000);
        return mil;
    } else if (isHour) {
        const hours = parseInt(object);
        const sec = (hours * 3600);
        const mil = (sec * 1000);
        return mil;
    } else {
        const sec = parseInt(object);
        const mil = (sec * 1000);
        return mil;
    }
}