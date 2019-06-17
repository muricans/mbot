const tls = require('../../tools');
const tools = new tls.Tools();

module.exports = {
  name: 'set',
  usage: '<user> <amount>',
  description: 'Sets the users points [dev only]',
  args: true,
  minArgs: 2,
  owner: true,
  roulette: true,
  execute(message, args, client) {
    const mention = tools.parseMention(args[0], client);
    if (!mention) {
      return message.reply('That user does not exist!');
    }
    const amnt = parseInt(args[1]);
    if (isNaN(amnt)) {
      return message.channel.send('Please use numbers!');
    }
    tools.setPoints(amnt, mention.id);
    return message.channel.send(`${message.author} You set ${mention}'s points to ${amnt}!`);
  },
};