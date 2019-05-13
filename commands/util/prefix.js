const fs = require('fs');

// configuration at later time

module.exports = {
  name: 'prefix',
  usage: '<newPrefix>',
  execute(message, args, client) {
    const weirdChamp = client.emojis.get("572690273247821824");

    let hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(message.author + " You don't have permission to use this command! " + weirdChamp);
    }
    if (args.length === 0) {
      return message.reply('Please add params! !prefix <newPrefix>');
    }
    let data = fs.readFile('settings.json', 'utf8', (err) => {
      if (err) console.log(err);
    });
    let parsedData = JSON.parse(data);
    parsedData.prefix = args[0];
    fs.writeFile('settings.json', JSON.stringify(parsedData), function (err) {
      if (err) {
        return console.log(err);
      }
    });
    message.channel.send(message.author + " New prefix set: " + args[0]);
  },
};