const tls = require('../../tools');
const tools = new tls.Tools();

module.exports = {
  name: 'points',
  usage: '[user]',
  description: `Returns the designated user's points`,
  roulette: true,
  async execute(message, args, client) {
    let current;
    let msg;
    const mention = tools.parseMention(args[0], client);
    if (!args.length) {
      current = await tools.getPoints(message.author.id);
      msg = `You have ${current} points!`;
    } else {
      if (!mention || mention.bot) return message.channel.send('Could not find that user!');
      current = await tools.getPoints(mention.id);
      msg = `${mention.username} has ${current} points!`;
      tools.addCooldown(this.name, 3, message);
    }
    return message.channel.send(msg);
  },
};