const tls = require('../../tools');
const tools = new tls.Tools();

module.exports = {
  name: 'set',
  usage: '<user> <amount>',
  description: 'Sets the users points [dev only]',
  args: true,
  minArgs: 2,
  owner: true,
  execute(message, args) {
    if (!message.mentions.users.first()) {
      return message.reply('That user does not exist!');
    }
    const amnt = parseInt(args[1]);
    if (isNaN(amnt)) {
      return message.channel.send('Please use numbers!');
    }
    tools.setPoints(amnt, message.mentions.users.first().id);
    return message.channel.send(`${message.author} You set ${message.mentions.users.first()}'s points to ${amnt}!`);
  },
};