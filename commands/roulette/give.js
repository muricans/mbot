const tls = require('../../tools');
const tools = new tls.Tools();

module.exports = {
  name: 'give',
  usage: '<user> <amount|all>',
  description: 'Gives a user [x] amount of points',
  cooldown: 3,
  args: true,
  minArgs: 2,
  mod: true,
  roulette: true,
  async execute(message, args) {
    if (message.mentions.users.first() === message.author) {
      return message.reply('You cannot give points to yourself!');
    }
    if (!message.mentions.users.first()) {
      return message.reply('That user does not exist!');
    }
    const mention = message.mentions.users.first();
    let current = await tools.getPoints(message.author.id);
    const give = parseInt(args[1]);
    let all = false;
    if (args[1] === "all") {
      all = true;
      tools.setPoints(0, message.author.id);
    }
    if (!all && isNaN(give)) return message.channel.send('Please use numbers!');
    let mentCurrent = await tools.getPoints(mention.id);
    let msg;
    if (all) {
      mentCurrent = mentCurrent + current;
      msg = `${message.author} You sent all your points to ${mention}!`;
      current = 0;
    } else {
      if (give > current) return message.channel.send(`${message.author} You don't have that many points!`);
      mentCurrent = mentCurrent + give;
      msg = `${message.author} You sent ${give} points to ${mention}!`;
      current = current - give;
    }
    tools.setPoints(mentCurrent, mention.id);
    tools.setPoints(current, message.author.id);
    tools.addCooldown(this.name, 3, message);
    return message.channel.send(msg);
  },
};