module.exports = {
  name: 'echo',
  usage: '<content>',
  async execute(message, args, client) {
    const weirdChamp = client.emojis.get("572690273247821824");
    let hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(message.author + " You don't have permission to use this command! " + weirdChamp);
    }
    const echo = args.join(' ');
    if (args.length === 0) {
      return message.reply('Please add parms! !echo <term>');
    }
    await message.channel.send(echo);
  },
};