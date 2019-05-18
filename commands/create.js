const fs = require('fs');
const tools = require('../tools.js');

module.exports = {
  name: 'create',
  usage: '<commandName> <message>',
  description: 'Adds a command to the bot',
  execute(message, args) {
    let stngs = fs.readFileSync('settings.json', 'utf8');
    let settings = JSON.parse(stngs);
    const prefix = settings.prefix;
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
      cmd.commands.push({
        name: args[0].toLowerCase(),
        message: msg
      });
      const json = JSON.stringify(cmd);
      fs.writeFile('commands.json', json, 'utf8', function (err) {
        if (err) {
          return console.log(err);
        }
      });
    });
    return message.channel.send(message.author + ' New command added! ' + prefix + args[0].toLowerCase() + ', which returns ' + msg);
  },
};