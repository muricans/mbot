const pkg = require('../../package.json');
const Discord = require('discord.js');

module.exports = {
    name: 'version',
    usage: 'No usage data',
    description: 'Gets the current version of the bot',
    cooldown: 3,
    execute(message, args) {
        const embed = new Discord.RichEmbed()
            .setTitle('mbot info')
            .setThumbnail('https://hotemoji.com/images/dl/v/robot-face-emoji-by-twitter.png')
            .setColor('#e9225f')
            .addField('Version', `v${pkg.version}`, true)
            .addField('Author', 'muricans', true)
            .addField('Repository', '[GitHub](https://github.com/muricans/mbot)', true)
            .addField('Documentation', '[Here](https://muricans.github.io/)', true);
        message.channel.send(embed);
    },
};