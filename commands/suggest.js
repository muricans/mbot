const fs = require('fs');

module.exports = {
    name: 'suggest',
    usage: '<suggestion>',
    description: 'Suggest a command or feature for the bot',
    execute(message, args) {
        if (args.length === 0) {
            return message.reply('Please add params! !suggest <suggestion>');
        }
        const suggestions = JSON.parse(fs.readFileSync('./suggestions.json', 'utf8'));
        suggestions.push({
            "suggestion": args.join(' '),
            "by": message.author.username
        });
        fs.writeFile('./suggestions.json', JSON.stringify(suggestions), (err) => {
            if (err) console.log(err);
            message.channel.send(`Added ${args.join(' ')} to suggestion list.`);
        });
    },
};