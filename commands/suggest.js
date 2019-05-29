const tls = require('../tools');
const suggestions = new tls.File('suggestions', './', 'json');

module.exports = {
    name: 'suggest',
    usage: '<suggestion>',
    description: 'Suggest a command or feature for the bot',
    cooldown: 86400,
    args: true,
    minArgs: 1,
    execute(message, args) {
        suggestions.add({
            "suggestion": args.join(' '),
            "by": message.author.username,
            "id": message.author.id,
            "guild": message.guild.id,
        }, () => {
            return message.channel.send(`Added ${args.join(' ')} to suggestion list.`);
        });
    },
};