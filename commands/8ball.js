const fs = require('fs');

module.exports = {
  name: '8ball',
  usage: '<question>',
  description: 'Ask the bot a question',
  cooldown: 1,
  args: true,
  minArgs: 1,
  execute(message) {
    const data = fs.readFileSync('response.json', 'utf8');
    const responses = JSON.parse(data);
    const good = responses.good;
    const unsure = responses.unsure;
    const bad = responses.bad;
    const all = [good.response, unsure.response, bad.response];
    const response = all[Math.floor(Math.random() * all.length)];
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