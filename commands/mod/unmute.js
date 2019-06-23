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
    permissions: ['KICK_MEMBERS', 'ADMINISTRATOR'],
    execute(message, args, client) {
        const mention = tools.parseMention(args[0], client);
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