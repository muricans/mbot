const Discord = require('discord.js');

module.exports = {
    guilds: new Discord.Collection(),
    mutes: new Discord.Collection(),
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
        let sec;
        let mil;
        let minutes;
        let out;
        if (hasMin(args[1])) {
            minutes = parseInt(args[1]);
            sec = (parseInt(args[1]) * 60);
            mil = (sec * 1000);
            let hours;
            if (minutes >= 60) {
                hours = Math.floor(minutes / 60);
            }
            out = minutes >= 60 ? `${hours} hour(s)` : `${minutes} minute(s)`;
        } else if (hasHour(args[1])) {
            const hours = (parseInt(args[1]));
            sec = (hours * 3600);
            mil = (sec * 1000);
            out = `${hours} hour(s)`;
        } else {
            sec = (parseInt(args[1]));
            mil = (sec * 1000);
            if (sec >= 60) {
                minutes = Math.floor(sec / 60);
            }
            out = sec >= 60 ? `${minutes} minute(s)` : `${sec} second(s)`;
        }
        muteMember(muted, mention.id, mil);
        return message.channel.send(`${message.author} muted ${mention} for ${out}!`);
    },
}

function muteMember(muted, id, mil) {
    module.exports.mutes.set(id, Date.now());
    muted.set(id, mil);
    setTimeout(() => muted.delete(id), mil);
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