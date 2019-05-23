const tools = require('../tools.js');
const fs = require('fs');

module.exports = {
  name: 'create',
  usage: '<commandName> <message>',
  description: 'Adds a command to the bot',
  execute(message, args, client, prefix) {
    if (args.length < 2) {
      return message.reply('Please add params! ' + prefix + 'create <commandName> <message>');
    }
    let cmd = {
      commands: []
    };
    let newArgs = args.slice(1, args.length);
    const msg = newArgs.join(' ');
    for (var i in tools.adminCommands) {
      if (msg.includes(prefix + tools.adminCommands[i])) {
        return message.channel.send(message.author + ' Cannot run admin commands!');
      }
    }
    fs.readFile('commands.json', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      cmd = JSON.parse(data);
      const exists = cmd.commands.find(cmd => cmd.name === args[0].toLowerCase() && cmd.server === message.guild.id.toString());
      if (exists) {
        return message.channel.send(`${message.author} That command already exists!`);
      }
      cmd.commands.push({
        server: message.guild.id.toString(),
        name: args[0].toLowerCase(),
        message: msg
      });
      const json = JSON.stringify(cmd);
      fs.writeFile('commands.json', json, (err) => {
        if (err) {
          return console.log(err);
        }
        message.channel.send(message.author + ' New command added! ' + prefix + args[0].toLowerCase() + ', which returns ' + msg);
      });
    });
  },
};