const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

module.exports = {
  name: 'give',
  execute(message, args) {
    if (args.length < 2) {
      return message.reply('Please add params: !give <@user> <amnt>');
    }
    if (message.mentions.users.first() === message.author) {
      return message.reply('You cannot give points to yourself!');
    }
    if (!message.mentions.users.first()) {
      return message.reply('That user does not exist!')
    }
    db.serialize(function() {
      db.get("SELECT points points FROM users WHERE id = " + message.author.id.toString(), function(err, row) {
        if (err) {
          return message.reply('That user does not exist!');
        }
        const give = parseInt(args[1]);
        if (isNaN(give)) {
          return message.reply('Please give a proper number!');
        }
        const current = parseInt(row.points.toString());
        if (give > current) {
          return message.reply("You don't have that many points! You have: " + current + " points.");
        }
        const newCurrent = current - give;
        db.run('UPDATE users SET points = ? WHERE id = ?', newCurrent, message.author.id.toString());
        db.get("SELECT points points FROM users where id = " + message.mentions.users.first().id.toString(), function(err, row2) {
          if (err) {
            return console.log(err);
          }
          const mentCurrent = parseInt(row2.points.toString());
          const mentNewCurrent = give + mentCurrent;
          db.run('UPDATE users SET points = ? WHERE id = ?', mentNewCurrent, message.mentions.users.first().id.toString());
          message.reply('You sent ' + give + ' points to ' + message.mentions.users.first() + ' !');
        });
      });
    });
  },
};