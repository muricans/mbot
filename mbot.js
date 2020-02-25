const figlet = require('figlet');
const chalk = require('chalk');
console.log(chalk.magenta(figlet.textSync('mbot', {
  font: "Doom",
  horizontalLayout: "full",
})));

/**
 * @typedef cmds 
 * @property {string} id The guild servers id.
 * @property {string} name The commands name.
 * @property {string} message The message the command outputs.
 * 
 * @typedef prefix
 * @property {string} id The guild servers id.
 * @property {string} prefix The guild servers command prefix.
 * 
 * @typedef nsfwModule
 * @property {string} id The guild servers id.
 * @property {boolean} use Is the guild using nsfw modules
 */
// init discord lib
const settings = require('./settings.json');
const pkg = require('./package.json');
const commands = require('./commands.js');
const tools = require('./tools.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const Logger = require('./logger');
const Database = require('./database/database');
const tls = new tools.Tools();

process.on('exit', (code) => {
  Logger.info(`mbot v${pkg.version} has exited with code (${code})`);
});

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
/**
 * @type {Array<prefix>}
 */
module.exports.prefixes = [];
/**
 * @type {Array<nsfwModule>}
 */
module.exports.nsfw = [];

const db = new Database('./mbot.db').db;

const startTime = Date.now();
db.prepare('CREATE TABLE if not exists users(id TEXT, points INTEGER, UNIQUE(id))').run();
db.prepare('CREATE TABLE if not exists welcomeMessage(id TEXT, use INTEGER, message TEXT, channel TEXT, UNIQUE(id))').run();
db.prepare('CREATE TABLE if not exists leaveMessage(id TEXT, use INTEGER, message TEXT, channel TEXT, UNIQUE(id))').run();
db.prepare('CREATE TABLE if not exists prefix(id TEXT, prefix TEXT, UNIQUE(id))').run();
db.prepare('CREATE TABLE if not exists serverInfo(id TEXT, use INTEGER, UNIQUE(id))').run();
db.prepare('CREATE TABLE if not exists commands(id TEXT, name TEXT, message TEXT)').run();
db.prepare('CREATE TABLE if not exists commandOptions(id TEXT, everyone INTEGER, use INTEGER, UNIQUE(id))').run();
db.prepare('CREATE TABLE if not exists roles(id TEXT, def TEXT, use INTEGER, UNIQUE(id))').run();
db.prepare('CREATE TABLE if not exists nsfw(id TEXT, use INTEGER, UNIQUE(id))').run();
db.prepare('CREATE TABLE if not exists blocked(id TEXT, UNIQUE(id))').run();
event.once('ready', () => {
  this.prefixes = [];
  this.nsfw = [];
  this.cCommands = [];
  for (const i in client.guilds.cache.array()) {
    const guild = client.guilds.cache.array()[i];
    const blocked = db.prepare('SELECT id id FROM blocked').all().find(row => row.id === guild.id);
    if (blocked !== undefined) guild.leave();
    else tls.initDb(guild);
  }
  tls._pointsClear24(client);
  json();
});

event.on('timerFinished', (userId, timerId, timerName) => {
  Logger.debug(`Timer ${timerId} has finished.`);
  client.users.fetch(userId, false).then(user => {
    user.send(`Your timer '${timerName}' has finished!`);
  }).catch();
});

client.on('guildCreate', (guild) => {
  const blocked = db.prepare('SELECT id id FROM blocked').all().find(row => row.id === guild.id);
  if (blocked !== undefined)
    guild.leave();
  else {
    tls.initDb(guild);
    this.prefixes.push({
      "id": guild.id,
      "prefix": "m!",
    });
    this.nsfw.push({
      "id": guild.id,
      "use": true,
    });
  }
});

client.on('guildDelete', (guild) => {
  tls.deleteGuild(guild).then(() => {
    tls._pointsClear24(client);
  });
});

client.on('guildMemberAdd', (guildMember) => {
  if (guildMember.guild.id === "264445053596991498") return;
  tls.getNLMessage('welcomeMessage', guildMember.guild.id, (use, msg, channel) => {
    if (guildMember.user.bot) return;
    if (use === 1) {
      const chnl = guildMember.guild.channels.find(c => c.name === channel);
      if (!chnl) {
        return;
      } else {
        chnl.send(msg.replace('$user', guildMember.user.username));
      }
    }
  });
  tls.getDefaultRole(guildMember.guild.id, (defaultRole, use) => {
    if (use === 1) {
      const role = guildMember.guild.roles.find((r => r.name === defaultRole));
      if (!role) {
        return;
      } else {
        guildMember.addRole(role);
      }
    }
  });
  tls.addMember(guildMember);
});

client.on('guildMemberRemove', (guildMember) => {
  if (guildMember.guild.id === "264445053596991498") return;
  tls.getNLMessage('leaveMessage', guildMember.guild.id.toString(), (use, msg, channel) => {
    if (guildMember.user.bot) return;
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
client.once('ready', async () => {
  event.emit('ready');
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
    tls._points10(client);
  }, (10 * 60000));
  setInterval(() => {
    tls._pointsClear24(client);
  }, (1440 * 60000));
});

/**
 * Get the bots uptime in hh:mm:ss format.
 * @returns {string}
 */
module.exports.getUptime = () => {
  const uptime = Date.now() - startTime;
  let seconds = Math.floor(uptime / 1000);
  const hours = Math.floor(seconds / 3600);
  seconds = Math.floor(seconds % 3600);
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  const h = hours < 10 ? "0" + hours : hours;
  const m = minutes < 10 ? "0" + minutes : minutes;
  const s = seconds < 10 ? "0" + seconds : seconds;
  return `${h}:${m}:${s}`;
};

//game | only allows for default emojis
const games = ['Minecraft', 'forsenPls', 'nymnBridge PewDiePie', 'wow',
  'This bot was made by me 😃', 'help me',
];
setInterval(() => {
  const randomStatus = games[Math.floor(Math.random() * games.length)];
  client.user.setActivity(randomStatus, {
    type: 'PLAYING',
  });
}, 60000);

event.on('filesLoaded', () => {
  Logger.file('Command files loaded!');
});

event.on('newCommand', (id, name, message) => {
  this.cCommands.push({
    "id": id,
    "name": name,
    "message": message,
  });
  Logger.debug(`Command ${name} was created in server ${id}.`);
});

event.on('deleteCommand', (id, name) => {
  const jsonCmd = this.cCommands.find(c => c.name.toLowerCase() === name && c.id === id);
  const cmdIndex = this.cCommands.indexOf(jsonCmd);
  this.cCommands.splice(cmdIndex, 1);
  Logger.debug(`Command ${name} was deleted from server ${id}.`);
});

event.on('editCommand', (command, msg) => {
  command.message = msg;
  Logger.debug(`Command ${command.name}'s message was updated to ${msg}`);
});

commands.registerCommands(client, this, tls.db);

process.openStdin().on('data', (val) => {
  const command = val.toString().trim();
  switch (command.toLowerCase()) {
    case "stop":
      Logger.info('Stopping mbot...');
      event.emit('stop', 0);
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

function json() {
  db.sqlite.each('id id, name name, message message', 'commands', (err, row) => {
    if (err) return console.log(err);
    if (!row) return;
    module.exports.cCommands.push({
      "id": row.id,
      "name": row.name,
      "message": row.message,
    });
  });
  db.sqlite.each('prefix prefix, id id', 'prefix', (err, row) => {
    if (err) return console.log(err);
    if (!row) return;
    module.exports.prefixes.push({
      "id": row.id,
      "prefix": row.prefix,
    });
  });
  db.sqlite.each('id id, use use', 'nsfw', (err, row) => {
    if (err) return console.log(err);
    if (!row) return;
    let use;
    if (row.use === 1) use = true;
    if (row.use === 0) use = false;
    module.exports.nsfw.push({
      "id": row.id,
      "use": use,
    });
  });
}

event.on('stop', (code) => {
  exit().then(() => {
    process.exit(code);
  }).catch(err => {
    Logger.error(err.stack);
    process.exit(1);
  });
});

event.on('prefixUpdate', (prefix, guildId) => {
  const guildPrefix = this.prefixes.find(guild => guild.id === guildId);
  guildPrefix.prefix = prefix;
});

event.on('nsfwUpdate', (use, guildId) => {
  const guildUse = this.nsfw.find(guild => guild.id === guildId);
  guildUse.use = use;
});

function exit() {
  return new Promise((resolve, reject) => {
    tls.close().then(() => {
      try {
        db.close();
        client.voice.connections.array().map(val => val.disconnect());
        client.destroy();
        return resolve();
      } catch (err) {
        return reject(err);
      }
    }).catch((err) => {
      return reject(err);
    });
  });
}

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