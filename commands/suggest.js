const fs = require('fs');

module.exports = {
    name: 'suggest',
    execute(message, args) {
        const suggestions = JSON.parse(fs.readFileSync('./suggestions.json', 'utf8'));
        suggestions.push({
            "suggestion": args.join(' '),
            "by": message.author.username
        });
        fs.writeFile('./suggestions.json', 'utf8', (err) => {
            if (err) console.log(err);
        });
    },
};