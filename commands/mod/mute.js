const Discord = require('discord.js');

module.exports = {
    guilds: new Discord.Collection(),
    mutes: new Discord.Collection(),
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
        let sec;
        let mil;
        let minutes;
        let out;
        if (args[1].includes("min")) {
            minutes = parseInt(args[1]);
            sec = (parseInt(args[1]) * 60);
            mil = (sec * 1000);
            let hours;
            if (minutes >= 60) {
                hours = Math.floor(minutes / 60);
            }
            out = minutes >= 60 ? `${hours} hour(s)` : `${minutes} minute(s)`;
            muted.set(mention.id, mil);
            this.mutes.set(mention.id, Date.now());
            setTimeout(() => muted.delete(mention.id), mil);
            return message.channel.send(`${message.author} muted ${mention} for ${out}!`);
        } else if (args[1].includes("hour")) {
            const hours = (parseInt(args[1]));
            sec = (hours * 3600);
            mil = (sec * 1000);
            out = `${hours} hour(s)`;
            muted.set(mention.id, mil);
            this.mutes.set(mention.id, Date.now());
            setTimeout(() => muted.delete(mention.id), mil);
            return message.channel.send(`${message.author} muted ${mention} for ${out}!`);
        } else {
            sec = (parseInt(args[1]));
            mil = (sec * 1000);
            if (sec >= 60) {
                minutes = Math.floor(sec / 60);
            }
            out = sec >= 60 ? `${minutes} minute(s)` : `${sec} second(s)`;
            muted.set(mention.id, mil);
            this.mutes.set(mention.id, Date.now());
            setTimeout(() => muted.delete(mention.id), mil);
            return message.channel.send(`${message.author} muted ${mention} for ${out}!`);
        }
    },
}