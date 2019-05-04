// init discord lib
const settings = require('./settings.json');
const package = require('./package.json');
const commands = require('./commands.js');
const tools = require('./tools.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to bot database');
});

db.serialize(function () {
  db.run('CREATE TABLE if not exists users(id TEXT, points INTEGER, UNIQUE(id))');
});

client.on('guildMemberAdd', (guildMember) => {
  db.serialize(function () {
    db.run('INSERT OR IGNORE INTO users(id, points) VALUES(?,?)', guildMember.user.id.toString(), 100);
    console.log('New user found, registering them to the bot database with ID of ' + guildMember.user.id.toString());
  });
});

// actions
client.on('ready', async () => {
  db.serialize(function () {
    var u, user;
    for (u in client.users.array()) {
      user = client.users.array()[u];
      db.run('INSERT OR IGNORE INTO users(id, points) VALUES(?,?)', user.id.toString(), 100);
    }
  });
  console.log('mbot v' + package.version + " has been enabled.");
  //game
  const games = ['Minecraft', 'Murdering Martine the BOT', 'nymnBridge PewDiePie', 'Acrozze a mega gay',
    'This bot was made by me :)', 'help me'
  ];
  setInterval(function () {
    const randomStatus = games[Math.floor(Math.random() * games.length)];
    client.user.setPresence({
      satus: 'online',
      game: {
        name: randomStatus
      }
    });
  }, 60000);
  if (settings.debug) {
    try {
      let link = await client.generateInvite(["ADMINISTRATOR"]);
      console.log(link);
    } catch (err) {
      console.log(err);
    }
  }
  /*setInterval(function () {
    db.serialize(function (err) {
      var uPoints;
      db.each("SELECT points points, id id FROM users", function (err, row) {
        if (err) {
          console.log(err);
        }
        var u, user;
        for (u in client.users.array()) {
          user = client.users.array()[u];
          tools.setPoints((row.points + 10), user.id.toString());
          return console.log("Set " + user.id.toString() + " to " + row.points);
        }
      });
    });
  }, 5000);*/
});

commands.registerCommands(client);
//login to the client
client.login(settings.token);