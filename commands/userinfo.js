const Discord = require('discord.js');

module.exports = {
  name: 'userinfo',
  execute(message, args) {
    let embed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setDescription('User info is being displayed.')
      .addField('Full Username', `${message.author.username}#${message.author.discriminator}`)
      .addField('ID', message.author.id)
      .addField('Time of Creation', message.author.createdAt)
      .addField('Avatar URL', message.author.avatarURL);
    message.channel.send(embed);
  },
};