const tls = require('./tools.js');
const tools = new tls.Tools();
const fs = require('fs');
const Discord = require('discord.js');
const mute = require('./commands/mod/mute');
const timer = require('./commands/util/timer');
const {
  bot_owners_id,
} = require('./settings.json');

const cooldowns = new Discord.Collection();
module.exports.getCooldowns = (key) => {
  return cooldowns.get(key);
};

/**
 * Register commands for the bot.
 * @param {Discord.Client} client The bots client.
 * @param mbot mbot main script.
 */
module.exports.registerCommands = async (client, mbot) => {
  client.commands = new Discord.Collection();
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const cmd = require(`./commands/${file}`);
    client.commands.set(cmd.name, cmd);
  }
  const rouletteFiles = fs.readdirSync('./commands/roulette').filter(file => file.endsWith('.js'));
  for (const file of rouletteFiles) {
    const rlt = require(`./commands/roulette/${file}`);
    client.commands.set(rlt.name, rlt);
  }
  const utilFiles = fs.readdirSync('./commands/util').filter(file => file.endsWith('.js'));
  for (const file of utilFiles) {
    const utl = require(`./commands/util/${file}`);
    client.commands.set(utl.name, utl);
  }
  const modFiles = fs.readdirSync('./commands/mod').filter(file => file.endsWith('.js'));
  for (const file of modFiles) {
    const mod = require(`./commands/mod/${file}`);
    client.commands.set(mod.name, mod);
  }

  mbot.event.emit('filesLoaded');

  const meme = ['comedycemetery', 'comedyheaven', 'dankmemes', 'me_irl', 'teenagers'];

  const anal = ['anal', 'analgw', 'painal'];
  const ass = ['ass', 'assinthong', 'assholebehindthong', 'bigasses', 'booty', 'buttplug', 'hungrybutts', 'paag', 'slimthick'];
  const blowjob = ['blowjobs', 'deepthroat', 'facefuck'];
  const boobs = ['boobbounce', 'boobies', 'boobs'];
  const dick = ['bulges', 'cock', 'dickpics4freedom', 'massivecock', 'penis', 'thickdick'];
  const gay = ['broslikeus', 'gaybrosgonewild', 'gaygifs', 'gayporn', 'ladybonersgw', 'men2men', 'TotallyStraight', 'twinks'];
  const hardcore = ['nsfwhardcore', 'shelikesitrough'];
  const hentai = ['ecchi', 'hentai', 'hentai_gif', 'sportshentai', 'thighdeology', 'westernhentai'];
  const nsfw = ['asianhotties', 'asiannsfw', 'asiansgonewild', 'nsfw', 'nsfw_gif', 'porninfifteenseconds'];
  // any other subredits?
  const pegging = ['pegging'];
  const rule34 = ['2booty', 'dbdgonewild', 'rule34', 'rule34lol', 'rule34rainbowsix'];
  const thighs = ['datgap', 'thighhighs'];
  const traps = ['delicioustraps', 'futanari', 'traphentai', 'traps'];

  const othercmds = [
    'ping', 'test', 'meme', 'trap', 'thighs', 'rule34', 'pegging',
    'nsfw', 'hentai', 'hardcore', 'gay', 'dick', 'boobs', 'blowjob',
    'ass', 'anal', 'uptime',
  ];

  function handleOther(command, message, args) {
    if (command === 'test') {
      message.channel.send("Test recieved").then(async sent => {
        sent.react("🔼");
        await sent.awaitReactions((reaction, user) => {
          if (reaction.emoji.name === "🔼" && user.id != client.user.id) {
            reaction.remove(message.author);
            sent.channel.send("Emoji recieved");
          }
        }, {
          time: 20000,
        });
      });
    }

    // commands here

    const ppHop = client.emojis.get("572687346529468428");
    if (command === 'ping') {
      message.reply('pong ' + ppHop + '\n mbot has been up for: ' + mbot.getUptime());
    }


    switch (command) {
      case "uptime":
        message.channel.send(`${message.author} mbot has been up for: ${mbot.getUptime()}`);
        break;

      case "meme":
        message.channel.startTyping();
        tools.search(meme[Math.floor(Math.random() * meme.length)], 'all', message, false);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;


        // porn commands

      case "anal":
        message.channel.startTyping();
        tools.search(anal[Math.floor(Math.random() * anal.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
      case "ass":
        message.channel.startTyping();
        tools.search(ass[Math.floor(Math.random() * ass.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
      case "blowjob":
        message.channel.startTyping();
        tools.search(blowjob[Math.floor(Math.random() * blowjob.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
      case "boobs":
        message.channel.startTyping();
        tools.search(boobs[Math.floor(Math.random() * boobs.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
      case "dick":
        message.channel.startTyping();
        tools.search(dick[Math.floor(Math.random() * dick.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
      case "gay":
        message.channel.startTyping();
        tools.search(gay[Math.floor(Math.random() * gay.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
      case "hardcore":
        message.channel.startTyping();
        tools.search(hardcore[Math.floor(Math.random() * hardcore.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
      case "hentai":
        message.channel.startTyping();
        tools.search(hentai[Math.floor(Math.random() * hentai.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
      case "nsfw":
        message.channel.startTyping();
        tools.search(nsfw[Math.floor(Math.random() * nsfw.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
      case "pegging":
        message.channel.startTyping();
        tools.search(pegging[Math.floor(Math.random() * pegging.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
        // rule34 code different than others
      case "rule34":
        message.channel.startTyping();
        if (!args.length) {
          tools.search(rule34[Math.floor(Math.random() * rule34.length)], 'all', message, true);
          message.delete(1000);
          return message.channel.stopTyping(true);
        }
        tools.find(rule34[Math.floor(Math.random() * rule34.length)], args.toString().replace(' ', '+'), 'all', message, true);
        message.channel.stopTyping(true);
        break;
      case "thighs":
        message.channel.startTyping();
        tools.search(thighs[Math.floor(Math.random() * thighs.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
      case "trap":
        message.channel.startTyping();
        tools.search(traps[Math.floor(Math.random() * traps.length)], 'all', message, true);
        message.delete(1000);
        message.channel.stopTyping(true);
        break;
    }
  }

  function doCommand(comm, message, prefix, args) {
    if (comm.args) {
      if (args.length < comm.minArgs) {
        return message.channel.send(`${message.author} Please add params! ${prefix}${comm.name} ${comm.usage}`);
      }
    }
    const isOwner = bot_owners_id.find(id => id === message.author.id);
    if (isOwner) {
      try {
        return comm.execute(message, args, client, prefix);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        tools.initCooldown(comm.name);
        if (!cooldowns.has(comm.name)) {
          cooldowns.set(comm.name, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = module.exports.getCooldowns(comm.name);
        module.exports.timestamps = timestamps;
        const cooldown = (comm.cooldown || 0) * 1000;
        if (tools.hasCooldown(comm.name, message)) {
          return message.channel.send(`${message.author} Please wait some time before using this command again!`);
        }
        if (timestamps.has(message.author.id)) {
          const exp = timestamps.get(message.author.id) + cooldown;
          if (now < exp) {
            const left = (exp - now) / 1000;
            return message.channel.send(`${message.author} Please wait ${left.toFixed(1)} second(s) before running that command again!`);
          }
        }
        comm.execute(message, args, client, prefix);
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldown);
      } catch (err) {
        console.log(err);
      }
    }
  }

  client.on('message', async message => {
    if (message.author.bot) return;
    if (!timer.users.has(message.author.id)) {
      timer.users.set(message.author.id, new Discord.Collection());
      const user = timer.users.get(message.author.id);
      user.set('timers', new Discord.Collection());
      user.set('dates', new Discord.Collection());
      user.set('timeouts', new Discord.Collection());
      user.set('names', new Discord.Collection());
      user.set('ids', new Discord.Collection());
      user.set('shortIds', new Discord.Collection());
    }
    if (message.channel.type === 'dm') {
      const args = message.content.split(' ');
      const command = args.shift().toLowerCase();
      switch (command) {
        case "timer":
          if (args.length < timer.minArgs) {
            return message.channel.send(`Please add params! ${timer.name} ${timer.usage}`);
          }
          client.commands.get('timer').execute(message, args);
          break;
      }
      return;
    }
    if (!mute.guilds.has(message.guild.id)) {
      mute.guilds.set(message.guild.id, new Discord.Collection());
    }
    const muted = mute.guilds.get(message.guild.id);
    if (muted.has(message.author.id)) {
      message.delete();
      const now = Date.now();
      const mutes = mute.mutesGuilds.get(message.guild.id);
      const exp = mutes.get(message.author.id) + muted.get(message.author.id);
      if (now < exp) {
        const left = (exp - now) / 1000;
        let timeLeft = Math.floor(left);
        if (timeLeft >= 3600) {
          const mins = Math.floor((left / 60) % 60);
          timeLeft = Math.floor(timeLeft / 3600);
          timeLeft += ` hour(s) and ${mins} minute(s)`;
        } else if (timeLeft >= 60) {
          const secs = Math.floor(left % 60);
          timeLeft = Math.floor(timeLeft / 60);
          timeLeft += ` minute(s) and ${secs} second(s)`;
        } else {
          timeLeft += ` second(s)`;
        }
        return message.author.send(`You are currently muted on ${message.guild.name}. Please wait ${timeLeft} before typing again!`).catch((err) => {
          if (err) return;
        });
      }
    }
    tools.getPrefix(message.guild.id.toString(), async (prefix) => {
      if (message.content.indexOf(prefix) !== 0) return;
      const args = message.content.slice(prefix.length).split(' ');
      const command = args.shift().toLowerCase();

      mbot.cCommands.map((value, i, cCommands) => {
        const jsonCmd = cCommands[i].name;
        const jsonMsg = cCommands[i].message;
        if (command === jsonCmd && cCommands[i].id === message.guild.id) {
          return tools.getCommandOptions(message.guild.id, async (everyone, use) => {
            if (use != 1) {
              return;
            }
            if (jsonMsg.startsWith('{module}')) {
              let mention = message.mentions.users.first();
              if (!mention) {
                mention = message.author;
              }
              const params = {
                mention: mention,
                author: message.author,
                prefix: prefix,
              };
              const parseCommandModule = await tools.parseCommandModule(jsonMsg, params);
              return message.channel.send(parseCommandModule);
            }
            return message.channel.send(jsonMsg);
          });
        }
      });

      othercmds.map((value, i, other) => {
        const othercmd = other[i];
        if (command === othercmd) {
          return handleOther(command, message, args);
        }
      });

      const comm = client.commands.get(command);
      if (!comm) {
        return;
      }

      if (comm.roulette && message.guild.id === "264445053596991498") return;

      if (comm.owner) {
        return fs.readFile('./settings.json', 'utf8', (err, data) => {
          if (err) return console.log(err);
          const settings = JSON.parse(data);
          for (const i in settings.bot_owners_id) {
            const owner = settings.bot_owners_id[i];
            if (message.author.id != owner) {
              return message.channel.send(`${message.author} You don't have permission to use this command!`);
            } else {
              return doCommand(comm, message, prefix, args);
            }
          }
        });
      } else if (comm.mod) {
        if (message.author.id === client.user.id) return;
        return doCommand(comm, message, prefix, args);
      } else {
        return doCommand(comm, message, prefix, args);
      }
    });
  });
};