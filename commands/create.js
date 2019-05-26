const tools = require('../tools.js');
const mbot = require('../mbot');
const sqlite = require('sqlite3').verbose();
const cCommands = mbot.cCommands;

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

module.exports = {
  name: 'create',
  usage: '<commandName> <message>',
  description: 'Adds a command to the bot',
  cooldown: 600,
  args: true,
  minArgs: 2,
  execute(message, args, client, prefix) {
    new tools.Tools().getCommandOptions(message.guild.id, (everyone) => {
      if (everyone != 1) {
        const hasAdmin = message.channel.permissionsFor(message.member).has('ADMINISTRATOR');
        if (!hasAdmin) {
          return message.channel.send(`${message.author} You don't have permission to use this command!`);
        }
      }
      const newArgs = args.slice(1, args.length);
      const msg = newArgs.join(' ');
      for (let i in tools.adminCommands) {
        if (msg.includes(prefix + tools.adminCommands[i])) {
          return message.channel.send(message.author + ' Cannot run admin commands!');
        }
      }
      const cmds = cCommands.filter(cmd => cmd.id === message.guild.id);
      const exists = cmds.find(cmd => cmd.name === args[0].toLowerCase());
      if (exists) {
        return message.channel.send(`${message.author} That command already exists!`);
      }
      db.run('INSERT INTO commands(id, name, message) VALUES(?,?,?)',
        message.guild.id,
        args[0].toLowerCase(),
        msg);
      mbot.event.emit('newCommand', message.guild.id, args[0].toLowerCase(), msg);
      return message.channel.send(`${message.author} New command added! ${prefix}${args[0].toLowerCase()}, which returns ${msg}`);
    });
  },
};