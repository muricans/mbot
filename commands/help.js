const Discord = require('discord.js');
const EmbedBuilder = require('../embedbuilder');

// 17 commands + [5 admin only commands] + 14 nsfw commands
// seperate admin only commands at a later time
module.exports = {
  name: 'help',
  usage: '[command]',
  description: 'Gives you a list of help commands, or info on a specified command.',
  cooldown: 3,
  execute(message, args, client, prefix, nsfwCmds) {
    if (!args.length) {
      const embedBuilder = new EmbedBuilder()
        .setChannel(message.channel)
        .setTime(35000);
      const cmds = client.commands.array().filter(cmd => cmd.nsfw !== true).sort();
      let method = Math.floor(cmds.length / 8) - 1;
      let pages = 0;
      for (let i = -1; i < method; i++) {
        pages++;
        embedBuilder.addEmbed(new Discord.RichEmbed());
        method = Math.floor(cmds.length / 8);
      }
      let multiplier = 1;
      for (let i = 0; i < 8 * multiplier; i++) {
        if (i === cmds.length)
          break;
        if (cmds[i]) {
          const cmd = cmds[i];
          embedBuilder.getEmbeds()[multiplier - 1]
            .addField(`${prefix}${cmd.name}`, cmd.description)
            .setFooter(`Page ${multiplier}/${pages}`);
          if (i === (8 * multiplier) - 1)
            multiplier++;
        }
      }
      embedBuilder.getEmbeds()[embedBuilder.getEmbeds().length - 1].addField('NSFW Commands', `${prefix}help nsfw`);
      return embedBuilder
        .setTitle('Commands')
        .build();
    }
    if (args[0].toLowerCase() === "nsfw") {
      const embedBuilder = new EmbedBuilder()
        .setChannel(message.channel)
        .setTime(35000);
      let method = Math.floor(nsfwCmds.length / 8) - 1;
      let pages = 0;
      for (let i = -1; i < method; i++) {
        pages++;
        embedBuilder.addEmbed(new Discord.RichEmbed());
        method = Math.floor(nsfwCmds.length / 8);
      }
      let multiplier = 1;
      for (let i = 0; i < 8 * multiplier; i++) {
        if (i === nsfwCmds.length)
          break;
        if (nsfwCmds[i]) {
          const cmd = nsfwCmds[i];
          embedBuilder.getEmbeds()[multiplier - 1]
            .addField(`${prefix}${cmd.name}`, cmd.description)
            .setFooter(`Page ${multiplier}/${pages}`);
          if (i === (8 * multiplier) - 1)
            multiplier++;
        }
      }
      return embedBuilder
        .setTitle('NSFW Commands')
        .build();
    }
    const cmd = client.commands.get(args[0].toLowerCase());
    if (!cmd) {
      const cmds = client.commands.array().filter(c => c.name.includes(args[0].toLowerCase()));
      if (!cmds.length)
        return message.channel.send(message.author + ' That command does not exist!');
      const embedBuilder = new EmbedBuilder()
        .setChannel(message.channel)
        .setTime(35000);
      let pages = 0;
      let m = 1;
      for (let i = 0; i < 8 * m; i++) {
        if (i === cmds.length)
          break;
        if (!embedBuilder.getEmbeds()[m - 1]) {
          embedBuilder.addEmbed(new Discord.RichEmbed());
          pages++;
        }
        if (i === (8 * m) - 1)
          m++;
      }
      let multiplier = 1;
      for (let i = 0; i < 8 * multiplier; i++) {
        if (i === cmds.length)
          break;
        if (cmds[i]) {
          const c = cmds[i];
          embedBuilder.getEmbeds()[multiplier - 1]
            .addField(`${prefix}${c.name}`, c.description)
            .setFooter(`Page ${multiplier}/${pages}`);
          if (i === (8 * multiplier) - 1)
            multiplier++;
        }
      }
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
    const embed = new Discord.RichEmbed()
      .setTitle(prefix + name)
      .addField('Usage ', usg)
      .addField('Description', desc);
    return message.channel.send(embed);
  },
};