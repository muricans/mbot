const fs = require('fs');
const tls = require('../tools');
const suggestions = new tls.File('suggestions', './', 'json');

module.exports = {
    name: 'suggest',
    usage: '<suggestion>',
    description: 'Suggest a command or feature for the bot',
    execute(message, args, client, prefix) {
        if (args.length === 0) {
            return message.reply(`Please add params! ${prefix}suggest <suggestion>`);
        }
        suggestions.add({
            "suggestion": args.join(' '),
            "by": message.author.username
        }, () => {
            return message.channel.send(`Added ${args.join(' ')} to suggestion list.`);
        });
    },
};