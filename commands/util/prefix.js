const settings = require('../../settings.json');
const fs = require('fs');

// configuration at later time

module.exports = {
  name: 'prefix',
  execute(message, args, prefix) {
    if (args.length === 0) {
      return message.reply('Please add params! ' + prefix + 'prefix <newPrefix>');
    }
    var data = fs.readFileSync('settings.json', 'utf8');
    data = {
      prefix: args[0]
    };
    fs.writeFile('settings.json', JSON.stringify(data), function(err) {
      if (err) {
        return console.log(err);
      }
    });
    message.channel.send(message.author + " New prefix set: " + args[0]);
  },
};