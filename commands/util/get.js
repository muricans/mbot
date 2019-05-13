const tools = require('../../tools');
const request = require('request');
const Discord = require('discord.js');

module.exports = {
    name: 'get',
    usage: '<id>',
    execute(message, args) {
        if (args.length === 0) {
            return message.reply('Please add params! !get <id>')
        }
        request(`http://157.230.208.246/api/members/id/${args[0]}`, (err, res, body) => {
            if (err) {
                console.log(err);
            }
            try {
                body = JSON.parse(body);
                const embed = new Discord.RichEmbed()
                    .setTitle(body.name)
                    .addField('ID', body.id)
                    .addField('Discord ID', body.discordId)
                    .setFooter(`Requested by: ${message.author.username}`);
                message.channel.send(embed);
            } catch (err) {
                message.channel.send(`${message.author} That user could not be found!`);
            }
        });
    },
};