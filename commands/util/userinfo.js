const Discord = require('discord.js');
const tls = require('../../tools');
const tools = new tls.Tools();

module.exports.cooldown = 0;

module.exports = {
  name: 'userinfo',
  usage: '[user]',
  description: `Returns the designated user's info`,
  execute(message, args, client) {
    if (args.length === 0) {
      const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setDescription('User info is being displayed.')
        .addField('Full Username', `${message.author.username}#${message.author.discriminator}`)
        .addField('ID', message.author.id)
        .addField('Time of Creation', message.author.createdAt)
        .addField('Avatar URL', message.author.avatarURL)
        .setThumbnail(message.author.avatarURL);
      return message.channel.send(embed);
    }
    if (isNaN(args[0])) {
      const mention = message.mentions.users.first();
      if (!mention) {
        return message.channel.send(`${message.author} Could not find that user!`);
      }
      const embed = new Discord.RichEmbed()
        .setAuthor(mention.username)
        .setDescription('User info is being displayed.')
        .addField('Full Username', `${mention.username}#${mention.discriminator}`)
        .addField('ID', mention.id)
        .addField('Time of Creation', mention.createdAt)
        .addField('Avatar URL', mention.avatarURL)
        .setThumbnail(mention.avatarURL);
      tools.addCooldown(module.exports.name, 5, message);
      return message.channel.send(embed);
    } else if (!isNaN(args[0])) {
      client.fetchUser(args[0].toString()).then((mention) => {
        const embed = new Discord.RichEmbed()
          .setAuthor(mention.username)
          .setDescription('User info is being displayed.')
          .addField('Full Username', `${mention.username}#${mention.discriminator}`)
          .addField('ID', mention.id)
          .addField('Time of Creation', mention.createdAt)
          .addField('Avatar URL', mention.avatarURL)
          .setThumbnail(mention.avatarURL);
        tools.addCooldown(module.exports.name, 5, message);
        return message.channel.send(embed);
      }).catch(() => {
        return message.channel.send(`${message.author} Could not find that user!`);
      });
    }
  },
};