module.exports = {
  name: 'echo',
  usage: '<message>',
  description: 'Returns your message from the bot [admin only]',
  cooldown: 5,
  args: true,
  minArgs: 1,
  mod: true,
  async execute(message, args, client) {
    const weirdChamp = client.emojis.get("572690273247821824");
    const hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(message.author + " You don't have permission to use this command! " + weirdChamp);
    }
    const echo = args.join(' ');
    await message.channel.send(echo);
  },
};