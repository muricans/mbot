module.exports = {
  name: 'roll',
  execute(message, args) {
    if (args.length === 0) {
      const roll = Math.floor(Math.random() * 6 + 1);
      return message.channel.send(message.author + ' You rolled a ' + roll + '!');
    }
    const roll = parseInt(args[0]);
    if (isNaN(roll)) {
      return message.reply('Please provide a number to roll!');
    } else {
      const randomRoll = Math.floor(Math.random() * roll + 1);
      return message.channel.send(message.author + ' You rolled a ' + randomRoll + '!');
    }
  },
};