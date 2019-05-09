const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

module.exports = {
  name: 'points',
  usage: '[user]',
  execute(message, args) {
    db.serialize(function () {
      if (args.length === 0) {
        db.get('SELECT points points FROM users WHERE id = ' + message.author.id.toString(), function (err, row) {
          if (err) {
            return console.log(err);
          }
          return message.reply('You have ' + row.points.toString() + ' points!');
        });
      }
      if (args.length > 0) {
        db.get('SELECT points points FROM users WHERE id = ' + message.mentions.users.first().id.toString(), function (err, row) {
          if (err) {
            return message.reply('No such user exists!');
          }
          return message.reply(message.mentions.users.first().username + ' has ' + row.points.toString() + ' points!');
        });
      }
    });
  },
};