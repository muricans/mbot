const pkg = require('../../package.json');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'version',
    usage: 'No usage data',
    description: 'Gets the current version of the bot',
    cooldown: 3,
    execute(message) {
        fs.readFile('./version.txt', 'utf8', (err, data) => {
            if (err) return console.log(err);
            const embed = new Discord.MessageEmbed()
                .setTitle('mbot info')
                .setThumbnail('https://hotemoji.com/images/dl/v/robot-face-emoji-by-twitter.png')
                .setColor('#e9225f')
                .addFields([{
                    name: 'Version',
                    value: `v${pkg.version}`,
                    inline: true,
                }])
                .addFields([{
                    name: 'Author',
                    value: 'muricans',
                    inline: true,
                }])
                .addFields([{
                    name: 'Repository',
                    value: '[GitHub](https://github.com/muricans/mbot)',
                    inline: true,
                }])
                .addFields([{
                    name: 'Documentation',
                    value: '[Here](https://muricans.github.io/mbot/docs)',
                    inline: true,
                }])
                .setFooter(`Git commit: ${data}`, 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png');
            message.channel.send(embed);
        });
    },
};