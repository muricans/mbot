const Discord = require('discord.js');

module.exports = {
  name: 'userinfo',
  usage: '[user]',
  execute(message, args, client) {
    if (args.length === 0) {
      let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setDescription('User info is being displayed.')
        .addField('Full Username', `${message.author.username}#${message.author.discriminator}`)
        .addField('ID', message.author.id)
        .addField('Time of Creation', message.author.createdAt)
        .addField('Avatar URL', message.author.avatarURL);
      return message.channel.send(embed);
    }
    const mention = message.mentions.users.first();
    let embed = new Discord.RichEmbed()
      .setAuthor(mention.username)
      .setDescription('User info is being displayed.')
      .addField('Full Username', `${mention.username}#${mention.discriminator}`)
      .addField('ID', mention.id)
      .addField('Time of Creation', mention.createdAt)
      .addField('Avatar URL', mention.avatarURL);
    return message.channel.send(embed);
    /*const mention = client.fetchUser(id);
    let embed = new Discord.RichEmbed()
      .setAuthor(mention.username)
      .setDescription('User info is being displayed.')
      .addField('Full Username', `${mention.username}#${mention.discriminator}`)
      .addField('ID', mention.id)
      .addField('Time of Creation', mention.createdAt)
      .addField('Avatar URL', mention.avatarURL);
    return message.channel.send(embed);*/
  },
};