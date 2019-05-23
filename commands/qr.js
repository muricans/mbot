const Discord = require('discord.js');

module.exports = {
    name: 'qr',
    usage: '<text|info>',
    description: 'Returns a QR code with the designated information',
    cooldown: 10,
    args: true,
    minArgs: 1,
    execute(message, args, client, prefix) {
        const newArgs = args.join(' ');
        const encoded = encodeURI(newArgs);
        message.delete();
        const embed = new Discord.RichEmbed()
            .setTitle('Your QR code:')
            .setImage('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encoded)
            .setFooter('Requested by: ' + message.author.username);
        return message.channel.send(embed);
    },
};