const mbot = require('../../mbot');

module.exports = {
  name: 'prefix',
  usage: '<newPrefix>',
  description: 'Changes the bots prefix [admin only]',
  cooldown: 60,
  args: true,
  minArgs: 1,
  mod: true,
  permissions: ['ADMINISTRATOR'],
  execute(message, args, client, prefix, db) {
    const newPrefix = args[0].toString();
    mbot.event.emit('prefixUpdate', newPrefix, message.guild.id);
    db.prepare(`UPDATE prefix SET prefix = ? WHERE id = ?`).run(newPrefix, message.guild.id);
    return message.channel.send(`${message.author}` + " New prefix set: " + args[0]);
  },
};