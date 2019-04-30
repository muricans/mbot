const fs = require('fs');

module.exports = {
  name: 'create',
  execute(message, args) {
    if (args.length < 2) {
      return message.reply('Please add params! !create <commandName> <message>');
    }
    var cmd = {
      table: []
    };
    var newArgs = args.slice(1, args.length);
    var msg = newArgs.join(' ');
    fs.readFile('commands.json', 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      cmd = JSON.parse(data);
      cmd.commands.push({
        name: args[0],
        message: msg
      });
      var json = JSON.stringify(cmd);
      fs.writeFile('commands.json', json, 'utf8', function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
    return message.channel.send(message.author + ' New command added! !' + args[0] + ', which returns ' + msg);
  },
};