const fs = require('fs');

module.exports = {
  name: '8ball',
  execute(message, args, client) {
    if (args.length === 0) {
      return message.reply('Please add params! !8ball <question>');
    }
    var data = fs.readFileSync('response.json', 'utf8');
    var responses = JSON.parse(data);
    var good = responses.good;
    var unsure = responses.unsure;
    var bad = responses.bad;
    var all = [good.response, unsure.response, bad.response];
    var response = all[Math.floor(Math.random() * all.length)];
    switch (response) {
      case good.response:
        message.channel.send(message.author + " " + good.response[Math.floor(Math.random() * good.response.length)] + " " +
          good.emotes[Math.floor(Math.random() * good.emotes.length)]);
        break;
      case unsure.response:
        message.channel.send(message.author + " " + unsure.response[Math.floor(Math.random() * unsure.response.length)] + " " +
          unsure.emotes[Math.floor(Math.random() * unsure.emotes.length)]);
        break;
      case bad.response:
        message.channel.send(message.author + " " + bad.response[Math.floor(Math.random() * bad.response.length)] + " " +
          bad.emotes[Math.floor(Math.random() * bad.emotes.length)]);
        break;
      default:
        message.channel.send('Error occured.');
        break;
    }
  },
};