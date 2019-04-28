const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

function won(amnt, message) {
  db.run('UPDATE users SET points = ? WHERE id = ?', amnt, message.author.id.toString());
}

module.exports = {
  name: 'roulette',
  execute(message, args) {
    if (args.length === 0) return message.channel.send('Please provide the amount you would like to roulette!');
    db.serialize(function() {
      db.get("SELECT points points FROM users WHERE id = " + message.author.id.toString(), function(err, row) {
        if (err) {
          return console.log(err);
        }
        const random = Math.floor(Math.random() * 100);
        const current = parseInt(row.points.toString());
        const num = parseInt(args[0]);
        if (current === 0) {
          return message.reply('You currently have no points!');
        }
        if (args[0] === "all") {
          if (random > 56) {
            const won = current * 2 + current;
            db.run('UPDATE users SET points = ? WHERE id = ?', won, message.author.id.toString());
            return message.reply(':ThanosSmile: You won ' + current * 2 + ' points!');
          } else {
            db.run('UPDATE users SET points = ? WHERE id = ?', 0, message.author.id.toString());
            return message.reply('You lost all your points!');
          }
        }
        if (isNaN(num)) {
          return message.reply('Your arguments are not a number or all! Please update them with such!');
        }
        if (num > current) {
          return message.reply("Sorry, you don't have that many points! Your current points: " + current);
        }
        if (random > 56) {
          const won = num * 2 + current;
          db.run('UPDATE users SET points = ? WHERE id = ?', won, message.author.id.toString());
          message.reply('You won ' + num * 2 + ' points!');
        } else {
          const lost = current - num;
          // if breaks (lose / 1)
          db.run('UPDATE users SET points = ? WHERE id = ?', lost, message.author.id.toString());
          message.reply('You lost ' + num + ' points!');
        }
      });
    });
  },
};