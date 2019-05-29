const sqlite = require('sqlite3').verbose();
const mbot = require('../mbot');
const cCommands = mbot.cCommands;

const db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

module.exports = {
  name: 'delete',
  usage: '<command>',
  description: 'Deletes a command [added by !create] from the bot [admin only]',
  cooldown: 5,
  args: true,
  minArgs: 1,
  execute(message, args, client) {
    const weirdChamp = client.emojis.get("572690273247821824");
    const hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(message.author + " You don't have permission to use this command! " + weirdChamp);
    }
    const cmds = cCommands.filter(cmd => cmd.id === message.guild.id);
    const exists = cmds.find(cmd => cmd.name === args[0].toLowerCase());
    if (!exists) {
      return message.channel.send(`${message.author} That command doesn't exist!`);
    }
    db.run('DELETE FROM commands WHERE id = ? AND name = ? AND message = ?', exists.id, exists.name, exists.message);
    mbot.event.emit('deleteCommand', exists.id, exists.name, exists.message);
    return message.channel.send(`${message.author} Command ${args[0].toLowerCase()} was deleted!`);
  },
};