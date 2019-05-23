const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

module.exports = {
  name: 'prefix',
  usage: '<newPrefix>',
  description: 'Changes the bots prefix [admin only]',
  cooldown: 60,
  args: true,
  minArgs: 1,
  execute(message, args, client, prefix) {
    const weirdChamp = client.emojis.get("572690273247821824");

    let hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(message.author + " You don't have permission to use this command! " + weirdChamp);
    }
    const newPrefix = args[0].toString();
    db.run(`UPDATE prefix SET prefix = ? WHERE id = ?`, newPrefix, message.guild.id.toString());
    return message.channel.send(message.author + " New prefix set: " + args[0]);
  },
};