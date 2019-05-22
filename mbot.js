// init discord lib
const settings = require('./settings.json');
const pkg = require('./package.json');
const commands = require('./commands.js');
const tools = require('./tools.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const sqlite = require('sqlite3').verbose();
const express = require('express');
const fs = require('fs');
const app = express();
const Logger = require('./logger');

if (settings.token === "YOURTOKEN") {
  Logger.error('Please add your token to the bot!');
  return process.exit(1);
}

app.use(express.json());

/**
 * This bots EventEmitter
 * @type {tools.Event}
 */
module.exports.event = new tools.Event();
const event = module.exports.event;

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  Logger.info('Connected to bot database');
});

let seconds = 0;
let minutes = 0;
let hours = 0;

db.serialize(function () {
  db.run('CREATE TABLE if not exists users(id TEXT, points INTEGER, UNIQUE(id))');
  db.run('CREATE TABLE if not exists welcomeMessage(id TEXT, use INTEGER, message TEXT, channel TEXT, UNIQUE(id))');
});

client.on('guildCreate', (guild) => {
  db.serialize(() => {
    db.run('INSERT OR IGNORE INTO welcomeMessage(id, use, message, channel) VALUES(?,?,?,?)',
      guild.id.toString(),
      0,
      'User $user has joined the server!',
      'general');
  });
});

client.on('guildMemberAdd', (guildMember) => {
  new tools.Tools().getStartMessage(guildMember.guild.id.toString(), (use, msg, channel) => {
    if (use === 1) {
      guildMember.guild.channels.find("name", channel).send(msg.replace('$user', guildMember.user.username));
    }
  });
  db.serialize(function () {
    db.run('INSERT OR IGNORE INTO users(id, points) VALUES(?,?)', guildMember.user.id.toString(), 100);
    if (settings.debug) {
      Logger.debug('New user found, registering them to the bot database with ID of ' + guildMember.user.id.toString());
    }
  });
});

client.on('guildMemberRemove', (guildMember) => {

});

// actions
client.on('ready', async () => {
  event.emit('ready');
  db.serialize(function () {
    var u, user;
    for (u in client.users.array()) {
      user = client.users.array()[u];
      db.run('INSERT OR IGNORE INTO users(id, points) VALUES(?,?)', user.id.toString(), 100);
    }
  });
  Logger.info('mbot v' + pkg.version + " has been enabled.");
  if (settings.debug) {
    try {
      let link = await client.generateInvite(["ADMINISTRATOR"]);
      Logger.debug(link);
    } catch (err) {
      console.log(err);
    }
  }
  setInterval(function () {
    db.serialize(function () {
      db.each("SELECT points points, id id FROM users", function (err, row) {
        if (err) {
          console.log(err);
        }
        var u, user;
        for (u in client.users.array()) {
          user = client.users.array()[u];
          if (row.id === user.id.toString()) {
            return new tools.Tools().setPoints((row.points + 10), user.id.toString());
          }
        }
      });
    });
  }, (60000 * 10));
  setInterval(() => {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      event.emit('uptimeMinute');
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
    }
  }, 1000);
});

/**
 * Get the bots uptime in hh:mm:ss format.
 * @returns {string}
 */
module.exports.getUptime = function () {
  const h = hours < 10 ? "0" + hours : hours;
  const m = minutes < 10 ? "0" + minutes : minutes;
  const s = seconds < 10 ? "0" + seconds : seconds;
  return `${h}:${m}:${s}`;
}

//game | only allows for default emojis
const games = ['Minecraft', 'Murdering Martine the BOT', 'nymnBridge PewDiePie', 'Acrozze a mega gay',
  'This bot was made by me 😃', 'help me'
];
event.on('uptimeMinute', () => {
  const randomStatus = games[Math.floor(Math.random() * games.length)];
  client.user.setPresence({
    satus: 'online',
    game: {
      name: randomStatus
    }
  });
});

event.on('filesLoaded', function () {
  Logger.file('Command files loaded!');
});

event.on('pointsUpdated', function (amnt, id) {
  if (settings.debug) {
    Logger.debug(`Set ${id}'s points to ${amnt}!`);
  }
});

commands.registerCommands(client, this);

app.get('/suggestions', (req, res) => {
  fs.createReadStream('./suggestions.json', 'utf8').on('data', (chunk) => {
    let suggestions = JSON.parse(chunk);
    res.send(suggestions);
  });
});

//app.listen(80);
//login to the client
client.login(settings.token);