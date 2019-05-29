const sqlite = require('sqlite3').verbose();
const tls = require('../../tools');
const tools = new tls.Tools();

const db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

module.exports = {
  name: 'set',
  usage: '<user> <amount>',
  description: 'Sets the users points [dev only]',
  args: true,
  minArgs: 2,
  owner: true,
  execute(message, args, client) {
    const weirdChamp = client.emojis.get("572690273247821824");
    if (message.author.id != "399121700429627393") {
      return message.channel.send(`${message.author} You don't have permission to use this command! ${weirdChamp}`);
    }
    if (!message.mentions.users.first()) {
      return message.reply('That user does not exist!');
    }
    db.serialize(() => {
      db.get("SELECT points points FROM users WHERE id = " + message.mentions.users.first().id.toString(), () => {
        const amnt = parseInt(args[1]);
        if (isNaN(amnt)) {
          return message.reply('Please use numbers!');
        }
        //db.run('UPDATE users SET points = ? WHERE id = ?', amnt, message.mentions.users.first().id.toString());
        tools.setPoints(amnt, message.mentions.users.first().id.toString());
        message.reply('You set ' + message.mentions.users.first() + ' points to ' + amnt + '!');
      });
    });
  },
};