const Discord = require('discord.js');
const EmbedBuilder = require('discord-embedbuilder');

// 17 commands + [5 admin only commands] + 14 nsfw commands
// seperate admin only commands at a later time
module.exports = {
  name: 'help',
  usage: '[command]',
  description: 'Gives you a list of help commands, or info on a specified command.',
  cooldown: 3,
  execute(message, args, client, prefix, db, nsfwCmds) {
    if (!args.length) {
      const embedBuilder = new EmbedBuilder()
        .setChannel(message.channel)
        .setTime(35000);
      const cmds = client.commands.array().filter(cmd => cmd.nsfw !== true);
      cmds.sort((a, b) => (a.name > b.name) ? 1 : -1);
      embedBuilder.calculatePages(cmds.length, 8, (embed, i) => {
        embed.addField(`${prefix}${cmds[i].name}`, cmds[i].description);
      });
      embedBuilder.getEmbeds()[embedBuilder.getEmbeds().length - 1].addField('NSFW Commands', `${prefix}help nsfw`);
      return embedBuilder
        .setTitle('Commands')
        .build();
    }
    if (args[0].toLowerCase() === "nsfw") {
      const embedBuilder = new EmbedBuilder()
        .setChannel(message.channel)
        .setTime(35000);
      embedBuilder.calculatePages(nsfwCmds.length, 8, (embed, i) => {
        embed.addField(`${prefix}${nsfwCmds[i].name}`, nsfwCmds[i].description);
      });
      return embedBuilder
        .setTitle('NSFW Commands')
        .build();
    }
    const cmd = client.commands.get(args[0].toLowerCase());
    if (!cmd) {
      const cmds = client.commands.array().filter(c => c.name.includes(args[0].toLowerCase()));
      if (!cmds.length)
        return message.channel.send(`${message.author}` + ' That command does not exist!');
      const embedBuilder = new EmbedBuilder()
        .setChannel(message.channel)
        .setTime(35000);
      embedBuilder.calculatePages(cmds.length, 8, (embed, i) => {
        embed.addField(`${prefix}${cmds[i].name}`, cmds[i].description);
      });
      return embedBuilder
        .setTitle(`Results with: ${args[0].toLowerCase()}`)
        .build();
    }
    const {
      usage,
      description,
      name,
    } = cmd;
    const desc = description || "No description defined.";
    const usg = usage || "No usage data found.";
    const embed = new Discord.MessageEmbed()
      .setTitle(prefix + name)
      .addField('Usage ', usg)
      .addField('Description', desc);
    return message.channel.send(embed);
  },
};