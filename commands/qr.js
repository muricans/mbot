const Discord = require('discord.js');

module.exports = {
    name: 'qr',
    execute(message, args) {
        if (args.length === 0) {
            return message.channel.send(message.author + ' Please add params! !qr <information>');
        }
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