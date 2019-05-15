const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'suggestions',
    execute(message, args) {
        const suggestions = JSON.parse(fs.readFileSync('./suggestions.json', 'utf8'));
        message.channel.send(suggestions);
    },
};