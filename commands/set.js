const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

module.exports = {
  name: 'set',
  execute(message, args) {
    let hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(message.author + " You don't have permission to use this command!");
    }
    if (args.length < 2) {
      return message.reply('Please add params! !set <@user> <points>');
    }
    if (!message.mentions.users.first()) {
      return message.reply('That user does not exist!');
    }
    db.serialize(function() {
      db.get("SELECT points points FROM users WHERE id = " + message.mentions.users.first().id.toString(), function(err, row) {
        const amnt = parseInt(args[1]);
        if (isNaN(amnt)) {
          return message.reply('Please use numbers!');
        }
        db.run('UPDATE users SET points = ? WHERE id = ?', amnt, message.mentions.users.first().id.toString());
        message.reply('You set ' + message.mentions.users.first() + ' points to ' + amnt + '!');
      });
    });
  },
};