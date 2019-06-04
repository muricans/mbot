const sqlite = require('sqlite3').verbose();
const tls = require('../../tools.js');
const tools = new tls.Tools();

const db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

module.exports = {
  name: 'roulette',
  usage: '<all|amount|percent>',
  description: 'Returns win/loss and new total points',
  cooldown: 5,
  args: true,
  minArgs: 1,
  mod: true,
  execute(message, args, client) {
    db.serialize(() => {
      db.get("SELECT points points FROM users WHERE id = " + message.author.id.toString(), (err, row) => {
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