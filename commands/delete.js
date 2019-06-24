const mbot = require('../mbot');
const cCommands = mbot.cCommands;

module.exports = {
  name: 'delete',
  usage: '<command>',
  description: 'Deletes a command [added by !create] from the bot [admin only]',
  cooldown: 5,
  args: true,
  minArgs: 1,
  mod: true,
  permissions: ['ADMINISTRATOR'],
  execute(message, args, client, prefix, db) {
    const cmds = cCommands.filter(cmd => cmd.id === message.guild.id);
    const exists = cmds.find(cmd => cmd.name === args[0].toLowerCase());
    if (!exists) {
      return message.channel.send(`${message.author} That command doesn't exist!`);
    }
    db.prepare('DELETE FROM commands WHERE id = ? AND name = ? AND message = ?').run(exists.id, exists.name, exists.message);
    mbot.event.emit('deleteCommand', exists.id, exists.name, exists.message);
    return message.channel.send(`${message.author} Command ${args[0].toLowerCase()} was deleted!`);
  },
};