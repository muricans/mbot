module.exports = {
  name: 'prefix',
  usage: '<newPrefix>',
  description: 'Changes the bots prefix [admin only]',
  cooldown: 60,
  args: true,
  minArgs: 1,
  mod: true,
  execute(message, args, client, prefix, db) {
    const weirdChamp = client.emojis.get("572690273247821824");

    const hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(`${message.author}` + " You don't have permission to use this command! " + weirdChamp);
    }
    const newPrefix = args[0].toString();
    db.run(`UPDATE prefix SET prefix = ? WHERE id = ?`, newPrefix, message.guild.id.toString());
    return message.channel.send(`${message.author}` + " New prefix set: " + args[0]);
  },
};