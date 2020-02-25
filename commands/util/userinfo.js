const Discord = require('discord.js');
const tls = require('../../tools');
const tools = new tls.Tools();

module.exports = {
  name: 'userinfo',
  usage: '[user]',
  description: `Returns the designated user's info`,
  async execute(message, args, client) {
    if (args.length === 0) {
      return message.channel.send(info(message.author, message));
    } else if (isNaN(args[0])) {
      const mention = tools.parseMention(args[0], client);
      if (!mention) return message.channel.send(`${message.author} Could not find that user!`);
      return message.channel.send(info(mention, message));
    } else if (!isNaN(args[0])) {
      try {
        const mention = await client.users.cache.fetch(args[0], false);
        return message.channel.send(info(mention));
      } catch (err) {
        return message.channel.send(`${message.author} Could not find that user!`);
      }
    }
  },
};

function info(mention, message) {
  const embed = new Discord.MessageEmbed()
    .setAuthor(`${mention.username}#${mention.discriminator}`)
    .setDescription('User info is being displayed');
  embed
    .addFields([{
      name: 'ID',
      value: mention.id,
    }])
    .addFields([{
      name: 'Time of Creation',
      value: mention.createdAt,
    }])
    .setThumbnail(mention.displayAvatarURL());
  if (message !== undefined) {
    const member = message.guild.member(mention);
    if (!member.roles.array().length || !member.roles.color || !member.roles.color.color) return embed;
    embed.setColor(message.guild.member(mention).roles.color.color);
  }
  return embed;
}