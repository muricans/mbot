const tls = require('../../tools');
const tools = new tls.Tools();
const Discord = require('discord.js');

const minAlias = ['min', 'minute', 'm', 'minutes', 'mins'];
const hourAlias = ['hour', 'hours', 'h', 'hr', 'hrs'];

module.exports = {
    guilds: new Discord.Collection(),
    mutesGuilds: new Discord.Collection(),
    timeoutsGuilds: new Discord.Collection(),
    name: 'mute',
    usage: `<user> <time?'min','hour'>`,
    description: 'Keeps a player from chatting for specified time.',
    args: true,
    minArgs: 2,
    execute(message, args, client) {
        const canKick = message.channel.permissionsFor(message.member).has("KICK_MEMBERS");
        if (!canKick) {
            return message.channel.send(`${message.author} You do not have permission to use this command!`);
        }
        if (!this.guilds.has(message.guild.id)) {
            this.guilds.set(message.guild.id, new Discord.Collection());
        }
        if (!this.mutesGuilds.has(message.guild.id)) {
            this.mutesGuilds.set(message.guild.id, new Discord.Collection());
            this.timeoutsGuilds.set(message.guild.id, new Discord.Collection());
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
        const mutes = this.mutesGuilds.get(message.guild.id);
        const timeouts = this.timeoutsGuilds.get(message.guild.id);
        if (muted.has(mention.id) || mutes.has(mention.id) || timeouts.has(mention.id)) {
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
        const mil = tools.parseTime(args[1]);
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
                out = `${sec} second(s)`;
            }
        }
        tools.muteMember(message.guild.id, mention.id, mil);
        return message.channel.send(`${message.author} muted ${mention} for ${out}!`);
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