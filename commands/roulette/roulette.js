const sqlite = require('sqlite3').verbose();
const tools = require('../../tools.js');

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

function setPoints(amnt, id) {
  db.run('UPDATE users SET points = ? WHERE id = ?', amnt, id);
}
module.exports = {
  name: 'roulette',
  usage: '<all|amount>',
  execute(message, args, client) {
    if (args.length === 0) return message.channel.send('Please provide the amount you would like to roulette!');
    db.serialize(function () {
      db.get("SELECT points points FROM users WHERE id = " + message.author.id.toString(), function (err, row) {
        if (err) {
          return console.log(err);
        }
        const current = parseInt(row.points.toString());
        let num = parseInt(args[0]);
        if (current === 0) {
          tools.setPoints(10, message.author.id.toString());
          return message.reply('You had 0 points, so I gave you +10 points!');
        }
        if (args[0] === "all") {
          num = current;
          return tools.roulette(num, current, message, client, true);
        }
        if (args[0].includes('%')) {
          const per = (current * num) / 100;
          const percentage = Math.round(per);
          if (percentage > current) {
            return message.reply("Sorry, you don't have that many points! Your current points: " + current);
          }
          return tools.roulette(percentage, current, message, client, false);
        }
        if (isNaN(num)) {
          return message.reply('Your arguments are not a number or all! Please update them with such!');
        }
        if (num > current) {
          return message.reply("Sorry, you don't have that many points! Your current points: " + current);
        }
        tools.roulette(num, current, message, client, false);
      });
    });
  },
};