const tools = require('../tools');
const commands = new tools.File('commands', './', 'json');

module.exports = {
  name: 'delete',
  usage: '<command>',
  description: 'Deletes a command [added by !create] from the bot [admin only]',
  cooldown: 5,
  args: true,
  minArgs: 1,
  execute(message, args, client, prefix) {
    const weirdChamp = client.emojis.get("572690273247821824");
    let hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(message.author + " You don't have permission to use this command! " + weirdChamp);
    }
    if (args.length < 1) {
      return message.reply(`Please add more params! ${prefix}delete <commandName>`);
    }
    commands.read((data) => {
      const cmds = data;
      const cmd = cmds.commands;
      let jsonCmd = cmd.find(c => c.name.toLowerCase() === args[0].toLowerCase() && c.server === message.guild.id.toString());
      if (!jsonCmd) {
        return message.reply('That command does not exist!');
      }
      const cmdIndex = cmd.indexOf(jsonCmd);
      cmd.splice(cmdIndex, 1);
      commands.write(cmds, () => {
        return message.channel.send(`${message.author} Command ${args[0].toLowerCase()} was deleted!`);
      });
    });
  },
};