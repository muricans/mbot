const mute = require('./mute');
const tls = require('../../tools');
const tools = new tls.Tools();

module.exports = {
    name: 'unmute',
    usage: '<user>',
    description: 'Unmute a muted user.',
    args: true,
    minArgs: 1,
    mod: true,
    execute(message) {
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
        tools.unmuteMember(message.guild.id, mention.id);
        return message.channel.send(`${message.author} Unmuted ${mention} successfully!`);
    },
};