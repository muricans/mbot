/**
 * @typedef cmds 
 * @property {string} id The guild servers id.
 * @property {string} name The commands name.
 * @property {string} message The message the command outputs.
 * 
 */
// init discord lib
const settings = require('./settings.json');
const pkg = require('./package.json');
const commands = require('./commands.js');
const tools = require('./tools.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const sqlite = require('sqlite3').verbose();
const Logger = require('./logger');
const figlet = require('figlet');
const chalk = require('chalk');

if (settings.token === "YOURTOKEN" || !settings.token.length) {
  Logger.error('Please add your token to the bot!');
  return process.exit(1);
}

/**
 * This bots EventEmitter
 * @type {tools.Event}
 */
module.exports.event = new tools.Event();
const event = module.exports.event;

let alive = false;

/**
 * The custom commands in the server.
 * @type {Array<cmds>}
 */
module.exports.cCommands = [];

const db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  Logger.info('Connected to bot database');
});

let seconds = 0;
let minutes = 0;
let hours = 0;

db.serialize(() => {
  db.run('CREATE TABLE if not exists users(id TEXT, points INTEGER, UNIQUE(id))');
  db.run('CREATE TABLE if not exists welcomeMessage(id TEXT, use INTEGER, message TEXT, channel TEXT, UNIQUE(id))');
  db.run('CREATE TABLE if not exists leaveMessage(id TEXT, use INTEGER, message TEXT, channel TEXT, UNIQUE(id))');
  db.run('CREATE TABLE if not exists prefix(id TEXT, prefix TEXT, UNIQUE(id))');
  db.run('CREATE TABLE if not exists serverInfo(id TEXT, use INTEGER, UNIQUE(id))');
  db.run('CREATE TABLE if not exists commands(id TEXT, name TEXT, message TEXT)');
  db.run('CREATE TABLE if not exists commandOptions(id TEXT, everyone INTEGER, use INTEGER, UNIQUE(id))');
  db.run('CREATE TABLE if not exists roles(id TEXT, def TEXT, use INTEGER, UNIQUE(id))');
});

/**
 * 
 * @param {Discord.Guild} guild 
 */
function initDb(guild) {
  if (guild.id === "264445053596991498") return;
  db.serialize(() => {
    db.run('INSERT OR IGNORE INTO welcomeMessage(id, use, message, channel) VALUES(?,?,?,?)',
      guild.id.toString(),
      0,
      'User $user has joined the server!',
      'general');
    db.run('INSERT OR IGNORE INTO leaveMessage(id, use, message, channel) VALUES(?,?,?,?)',
      guild.id.toString(),
      0,
      'User $user has left the server!',
      'general');
    db.run('INSERT OR IGNORE INTO prefix(id, prefix) VALUES(?,?)',
      guild.id.toString(),
      'm!');
    db.run('INSERT OR IGNORE INTO serverInfo(id, use) VALUES(?,?)',
      guild.id.toString(),
      1);
    db.run('INSERT OR IGNORE INTO commandOptions(id, everyone, use) VALUES(?,?,?)',
      guild.id.toString(),
      1,
      1);
    db.run('INSERT OR IGNORE INTO roles(id, def, use) VALUES(?,?,?)',
      guild.id.toString(),
      '_none',
      1);
    for (let i = 0; i < guild.members.array().length; i++) {
      const guildMember = guild.members.array()[i];
      db.run('INSERT OR IGNORE INTO users(id, points) VALUES(?,?)', guildMember.user.id.toString(), 100);
    }
  });
}

event.on('ready', () => {
  for (const i in client.guilds.array()) {
    const guild = client.guilds.array()[i];
    initDb(guild);
  }
  db.each('SELECT id id, name name, message message FROM commands', (err, row) => {
    if (err) return console.log(err);
    if (!row) {
      return;
    }
    module.exports.cCommands.push({
      "id": row.id,
      "name": row.name,
      "message": row.message,
    });
  });
  event.on('timerFinished', (userId, timerId, timerName) => {
    Logger.debug(`Timer ${timerId} has finished.`);
    client.fetchUser(userId).then(user => {
      user.send(`Your timer '${timerName}' has finished!`);
    }).catch();
  });
});

client.on('guildCreate', (guild) => {
  initDb(guild);
});

client.on('guildMemberAdd', (guildMember) => {
  if (guildMember.guild.id === "264445053596991498") return;
  new tools.Tools().getNLMessage('welcomeMessage', guildMember.guild.id, (use, msg, channel) => {
    if (use === 1) {
      const chnl = guildMember.guild.channels.find(c => c.name === channel);
      if (!chnl) {
        return;
      } else {
        chnl.send(msg.replace('$user', guildMember.user.username));
      }
    }
  });
  new tools.Tools().getDefaultRole(guildMember.guild.id, (defaultRole, use) => {
    if (use === 1) {
      const role = guildMember.guild.roles.find((r => r.name === defaultRole));
      if (!role) {
        return;
      } else {
        guildMember.addRole(role);
      }
    }
  });
  db.serialize(() => {
    db.run('INSERT OR IGNORE INTO users(id, points) VALUES(?,?)', guildMember.user.id.toString(), 100);
    if (settings.debug) {
      Logger.debug('New user found, registering them to the bot database with ID of ' + guildMember.user.id.toString());
    }
  });
});

client.on('guildMemberRemove', (guildMember) => {
  if (guildMember.guild.id === "264445053596991498") return;
  new tools.Tools().getNLMessage('leaveMessage', guildMember.guild.id.toString(), (use, msg, channel) => {
    if (use === 1) {
      const chnl = guildMember.guild.channels.find(c => c.name === channel);
      if (!chnl) {
        return;
      } else {
        chnl.send(msg.replace('$user', guildMember.user.username));
      }
    }
  });
});

// actions
client.on('ready', async () => {
  event.emit('ready');
  db.serialize(() => {
    let u, user;
    for (u in client.users.array()) {
      user = client.users.array()[u];
      db.run('INSERT OR IGNORE INTO users(id, points) VALUES(?,?)', user.id.toString(), 100);
    }
  });
  Logger.info('mbot v' + pkg.version + " has been enabled.");
  if (settings.debug) {
    try {
      const link = await client.generateInvite(268823670);
      Logger.debug(link);
    } catch (err) {
      console.log(err);
    }
  }
  setInterval(() => {
    db.serialize(() => {
      db.each("SELECT points points, id id FROM users", (err, row) => {
        if (err) {
          console.log(err);
        }
        let u, user;
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
module.exports.getUptime = () => {
  const h = hours < 10 ? "0" + hours : hours;
  const m = minutes < 10 ? "0" + minutes : minutes;
  const s = seconds < 10 ? "0" + seconds : seconds;
  return `${h}:${m}:${s}`;
};

//game | only allows for default emojis
const games = ['Minecraft', 'forsenPls', 'nymnBridge PewDiePie', 'wow',
  'This bot was made by me 😃', 'help me',
];
event.on('uptimeMinute', () => {
  const randomStatus = games[Math.floor(Math.random() * games.length)];
  client.user.setPresence({
    satus: 'online',
    game: {
      name: randomStatus,
    },
  });
});

event.on('filesLoaded', () => {
  Logger.file('Command files loaded!');
});

event.on('pointsUpdated', (amnt, id) => {
  if (settings.debug) {
    Logger.debug(`Set ${id}'s points to ${amnt}!`);
  }
});

event.on('newCommand', (id, name, message) => {
  module.exports.cCommands.push({
    "id": id,
    "name": name,
    "message": message,
  });
  Logger.debug(`Command ${name} was created in server ${id}.`);
});

event.on('deleteCommand', (id, name) => {
  const jsonCmd = module.exports.cCommands.find(c => c.name.toLowerCase() === name && c.id === id);
  const cmdIndex = module.exports.cCommands.indexOf(jsonCmd);
  module.exports.cCommands.splice(cmdIndex, 1);
  Logger.debug(`Command ${name} was deleted from server ${id}.`);
});

event.on('editCommand', (command, msg) => {
  command.message = msg;
  Logger.debug(`Command ${command.name}'s message was updated to ${msg}`);
});

console.log(chalk.magenta(figlet.textSync('mbot', {
  font: "Doom",
  horizontalLayout: "full",
})));

commands.registerCommands(client, this);

process.openStdin().on('data', (val) => {
  const command = val.toString().trim();
  switch (command.toLowerCase()) {
    case "stop":
      Logger.info('Stopping mbot...');
      process.exit(0);
      break;
    case "version":
      require('fs').readFile('./version.txt', 'utf8', (err, data) => {
        if (err) return Logger.error(err.stack);
        Logger.info(`Application: mbot
      Version: ${pkg.version}
      Author: Muricans
      Git repo: https://github.com/muricans/mbot
      Git commit: ${data}
      Website: https://muricans.github.io/mbot`);
      });
      break;
    case "help":
      Logger.info(`Commands:
      stop - stops the bot
      version - gets the bots version and other information`);
      break;
  }
});

process.on('exit', (code) => {
  Logger.info(`mbot v${pkg.version} has exited with code (${code})`);
});

setTimeout(() => {
  if (!alive) {
    Logger.warn("mbot is having trouble contacting discord...");
    setTimeout(() => {
      Logger.error("Failed to contact discord, stopping bot.");
      process.exit(1);
    }, 30000);
  }
}, 5000);

//login to the client
client.login(settings.token).then(() => {
  alive = true;
}).catch(err => {
  if (err) {
    if (settings.debug) {
      return console.log(err);
    } else {
      Logger.error('There was an error starting the bot. Maybe check credentials?\nTo check the actual error, enable debug in your settings file.');
    }
  }
});