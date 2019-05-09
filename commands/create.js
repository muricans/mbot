const fs = require('fs');
const tools = require('../tools.js');

module.exports = {
  name: 'create',
  execute(message, args) {
    if (args.length < 2) {
      return message.reply('Please add params! ' + tools.prefix + 'create <commandName> <message>');
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
      cmd.commands.push({
        name: args[0],
        message: msg
      });
      const json = JSON.stringify(cmd);
      fs.writeFile('commands.json', json, 'utf8', function (err) {
        if (err) {
          return console.log(err);
        }
      });
    });
    return message.channel.send(message.author + ' New command added! ' + tools.prefix + args[0] + ', which returns ' + msg);
  },
};