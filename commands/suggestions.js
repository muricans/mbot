const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'suggestions',
    execute(message, args) {
        const suggestions = JSON.parse(fs.readFileSync('./suggestions.json', 'utf8'));
        for (var i in suggestions) {
            message.channel.send(suggestions[i].suggestion + '\n' + suggestions[i].by);
        }
    },
};