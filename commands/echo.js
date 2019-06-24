module.exports = {
  name: 'echo',
  usage: '<message>',
  description: 'Returns your message from the bot [admin only]',
  cooldown: 5,
  args: true,
  minArgs: 1,
  mod: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message, args) {
    const echo = args.join(' ');
    await message.channel.send(echo);
  },
};