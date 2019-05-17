const fs = require('fs');

module.exports = {
    name: 'suggestions',
    usage: '[clear]',
    description: 'Check the suggestions, (include <clear> [admin only] to clear the suggestions)',
    execute(message, args) {
        if (args.length === 0) {
            const suggestions = JSON.parse(fs.readFileSync('./suggestions.json', 'utf8'));
            for (var i in suggestions) {
                message.channel.send(suggestions[i].suggestion + '\n' + suggestions[i].by);
            }
            return;
        }
        if (args[0] === "clear") {
            let hasAdmin = message.channel.permissionsFor(message.author).has("ADMINISTRATOR");
            if (!hasAdmin) return message.channel.send(message.author + ' You do not have permission to use this command!');
            else {
                return fs.writeFile('./suggestions.json', JSON.stringify([]), (err) => {
                    if (err) console.log(err);
                    message.channel.send('Cleared suggestions list.');
                });
            }
        } else {
            return message.channel.send('Invalid usage! !suggestions [clear]');
        }
    },
};