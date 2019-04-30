const settings = require('../../settings.json');

// configuration at later time

module.exports = {
  name: 'prefix',
  execute(message, args, prefix) {
    if (args.length === 0) {
      return message.reply('Please add params! ' + prefix + 'prefix <newPrefix>');
    }
    var data = fs.readFileSync('commands.json', 'utf8');
    var settings = JSON.parse(data);
    var prf = settings.prefix;
  },
};