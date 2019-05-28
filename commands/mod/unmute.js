const mute = require('./mute');
const Discord = require('discord.js');

module.exports = {
    name: 'unmute',
    usage: '<user>',
    description: 'Unmute a muted user.',
    args: true,
    minArgs: 1,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    execute(message, args) {
        const canKick = message.channel.permissionsFor(message.member).has("KICK_MEMBERS");
        if (!canKick) {
            return message.channel.send(`${message.author} You do not have permission to use this command!`);
        }
        const mention = message.mentions.users.first();
        if (!mention) {
            return message.channel.send(`${message.author} Could not find that user!`);
        }
        const muted = mute.guilds.get(message.guild.id);
        if (!muted.has(mention.id)) {
            return message.channel.send(`${message.author} That user is not currently muted!`);
        }
        muted.delete(mention.id);
        mute.mutes.delete(mention.id);
        clearTimeout(mute.timeouts.get(mention.id));
        mute.timeouts.delete(mention.id);
        return message.channel.send(`${message.author} Unmuted ${mention} successfully!`);
    },
}