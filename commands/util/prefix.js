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
    var stngs = JSON.parse(data);
    stngs.push('prefix: ' + args[0]);
    var json = JSON.stringify(stngs);
    fs.appendFileSync('settings.json', json);
  },
};