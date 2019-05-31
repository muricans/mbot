const tls = require('../tools');
const suggestions = new tls.File('suggestions', './', 'json');
const Discord = require('discord.js');

module.exports = {
    name: 'suggestions',
    usage: '[clear]',
    description: 'Check the suggestions, (include <clear> [admin only] to clear the suggestions)',
    owner: true,
    execute(message, args, client, prefix) {
        if (args.length === 0) {
            const attch = new Discord.Attachment(suggestions.file);
            return message.channel.send(attch);
        }
        if (args[0] === "clear") {
            suggestions.write([], () => {
                return message.channel.send('Cleared suggestions list.');
            });
        } else {
            return message.channel.send(`Invalid usage! ${prefix}suggestions [clear]`);
        }
    },
};