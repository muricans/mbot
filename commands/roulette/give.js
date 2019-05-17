const sqlite = require('sqlite3').verbose();
const tls = require('../../tools');
const tools = new tls.Tools();

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

module.exports = {
  name: 'give',
  usage: '<user> <amount|all>',
  description: 'Gives a user [x] amount of points',
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
    db.serialize(function () {
      db.get("SELECT points points FROM users WHERE id = " + message.author.id.toString(), function (err, row) {
        if (err) {
          return message.reply('That user does not exist!');
        }
        const give = parseInt(args[1]);
        if (args[1] === "all") {
          let all = parseInt(row.points.toString());
          //db.run('UPDATE users SET points = ? WHERE id = ?', 0, message.author.id.toString());
          tools.setPoints(0, message.author.id.toString());
          db.get("SELECT points points FROM users where id = " + message.mentions.users.first().id.toString(), function (err, row2) {
            if (err) {
              return console.log(err);
            }
            const mentCurrent = parseInt(row2.points.toString());
            const mentNewCurrent = all + mentCurrent;
            //db.run('UPDATE users SET points = ? WHERE id = ?', mentNewCurrent, message.mentions.users.first().id.toString());
            tools.setPoints(mentNewCurrent, message.mentions.users.first().id.toString());
            return message.reply('You sent all your points to ' + message.mentions.users.first() + '!');
          });
          return;
        }
        if (isNaN(give)) {
          return message.reply('Please give a proper number!');
        }
        const current = parseInt(row.points.toString());
        if (give > current) {
          return message.reply("You don't have that many points! You have: " + current + " points.");
        }
        const newCurrent = current - give;
        //db.run('UPDATE users SET points = ? WHERE id = ?', newCurrent, message.author.id.toString());
        tools.setPoints(newCurrent, message.author.id.toString());
        db.get("SELECT points points FROM users where id = " + message.mentions.users.first().id.toString(), function (err, row2) {
          if (err) {
            return console.log(err);
          }
          const mentCurrent = parseInt(row2.points.toString());
          const mentNewCurrent = give + mentCurrent;
          //db.run('UPDATE users SET points = ? WHERE id = ?', mentNewCurrent, message.mentions.users.first().id.toString());
          tools.setPoints(mentNewCurrent, message.mentions.users.first().id.toString());
          message.reply('You sent ' + give + ' points to ' + message.mentions.users.first() + '!');
        });
      });
    });
  },
};