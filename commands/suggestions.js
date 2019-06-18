const tls = require('../tools');
const suggestions = new tls.File('suggestions', './', 'json');

module.exports = {
    name: 'suggestions',
    usage: '[clear]',
    description: 'Check the suggestions, (include <clear> [admin only] to clear the suggestions)',
    owner: true,
    execute(message, args, client, prefix) {
        if (args.length === 0) {
            return suggestions.read(data => {
                let toSend = '';
                for (let i = 0; i < data.length; i++)
                    toSend += `${i + 1}. ${data[i].by}: ${data[i].suggestion}\n`;
                message.channel.send(toSend || 'No suggestions found.');
            });
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