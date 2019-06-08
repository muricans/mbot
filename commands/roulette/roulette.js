const tls = require('../../tools.js');
const tools = new tls.Tools();

module.exports = {
  name: 'roulette',
  usage: '<all|amount|percent>',
  description: 'Returns win/loss and new total points',
  cooldown: 5,
  args: true,
  minArgs: 1,
  mod: true,
  async execute(message, args, client) {
    const current = await tools.getPoints(message.author.id);
    const num = parseInt(args[0]);
    if (current === 0) {
      return message.channel.send(`${message.author} You don't have enough points!`);
    }
    if (args[0] === "all") {
      return tools.roulette(current, current, message, client, true);
    } else if (args[0].endsWith('%')) {
      let percentage = tools.parsePercent(current * num);
      console.log(percentage);
      if (percentage > current) {
        percentage = current;
      }
      return tools.roulette(percentage, current, message, client, false);
    } else if (isNaN(num)) {
      return message.channel.send('Please use numbers!');
    } else if (num > current) {
      return message.channel.send(`${message.author} You don't have enough points!`);
    } else {
      return tools.roulette(num, current, message, client, false);
    }
  },
};