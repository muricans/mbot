const Discord = require('discord.js');
const EmbedBuilder = require('discord-embedbuilder');
const {
  Tools,
} = require('../tools');
const tools = new Tools();

// 17 commands + [5 admin only commands] + 14 nsfw commands
// seperate admin only commands at a later time
module.exports = {
  name: 'help',
  usage: '[command]',
  description: 'Gives you a list of help commands, or info on a specified command.',
  cooldown: 3,
  execute(message, args, client, prefix, db, nsfwCmds) {
    if (!args.length) {
      const cmds = client.commands.array().filter(cmd => cmd.nsfw !== true).sort((a, b) => (a.name > b.name) ? 1 : -1);

      const builder = new EmbedBuilder(message.channel)
        .setTime(35000)
        .calculatePages(cmds.length, 8, (embed, i) => {
          embed.addFields([{
            name: `${prefix}${cmds[i].name}`,
            value: cmds[i].description,
          }]);
        });
      if (tools.usingNsfwModules(message.guild.id)) {
        builder.getEmbeds()[builder.getEmbeds().length - 1].addFields([{
          name: 'NSFW Commands',
          value: '!help nsfw or continue to the next page...',
        }]);
        const nsfwBuilder = new EmbedBuilder(message.channel)
          .calculatePages(nsfwCmds.length, 8, (embed, i) => {
            embed.addFields([{
              name: `${prefix}${nsfwCmds[i].name}`,
              value: nsfwCmds[i].description,
            }]);
          })
          .setTitle('NSFW Commands');
        builder
          .setTitle('Commands')
          .concatEmbeds(nsfwBuilder.getEmbeds());
      } else {
        builder.setTitle('Commands');
      }
      return builder.build();
    }
    if (args[0].toLowerCase() === "nsfw" && tools.usingNsfwModules(message.guild.id)) {
      const embedBuilder = new EmbedBuilder(message.channel)
        .setTime(35000);
      embedBuilder.calculatePages(nsfwCmds.length, 8, (embed, i) => {
        embed.addFields([{
          name: `${prefix}${nsfwCmds[i].name}`,
          value: nsfwCmds[i].description,
        }]);
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
      const embedBuilder = new EmbedBuilder(message.channel)
        .setTime(35000);
      embedBuilder.calculatePages(cmds.length, 8, (embed, i) => {
        embed.addFields([{
          name: `${prefix}${cmds[i].name}`,
          value: cmds[i].description,
        }]);
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
      .addFields([{
        name: 'Usage ',
        value: usg,
      }])
      .addFields([{
        names: 'Description',
        value: desc,
      }]);
    return message.channel.send(embed);
  },
};