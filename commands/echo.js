module.exports = {
  name: 'echo',
  async execute(message, args) {
    let hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(message.author + " You don't have permission to use this command!");
    }
    const echo = args.join(' ');
    if (args.length === 0) {
      return message.reply('Please add parms! !echo <term>');
    }
    await message.channel.send(echo);
  },
};