const tls = require('./tools.js');
const tools = new tls.Tools();
const fs = require('fs');
const sqlite = require('sqlite3').verbose();
const Discord = require('discord.js');

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

/**
 * Register commands for the bot.
 * @param {Discord.Client} client The bots client.
 * @param mbot mbot main script.
 */
module.exports.registerCommands = async function (client, mbot) {
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
  const pegging = ['pegging']; // any other subredits?
  const rule34 = ['2booty', 'dbdgonewild', 'rule34', 'rule34lol', 'rule34rainbowsix'];
  const thighs = ['datgap', 'thighhighs'];
  const traps = ['delicioustraps', 'futanari', 'traphentai', 'traps'];

  const othercmds = [
    'ping', 'test', 'meme', 'trap', 'thighs', 'rule34', 'pegging',
    'nsfw', 'hentai', 'hardcore', 'gay', 'dick', 'boobs', 'blowjob',
    'ass', 'anal', 'uptime'
  ];

  function handleOther(command, message, args) {
    if (command === 'test') {
      message.channel.send("Test recieved").then(async sent => {
        sent.react("🔼");
        await sent.awaitReactions(reaction => {
          if (reaction.emoji.name === "🔼") {
            sent.channel.send("Emoji recieved");
          }
        }, {
          time: 20000
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
        tools.search(meme[Math.floor(Math.random() * meme.length)], 'all', message, false);
        message.delete(1000);
        break;


        // porn commands

      case "anal":
        tools.search(anal[Math.floor(Math.random() * anal.length)], 'all', message, true);
        message.delete(1000);
        break;
      case "ass":
        tools.search(ass[Math.floor(Math.random() * ass.length)], 'all', message, true);
        message.delete(1000);
        break;
      case "blowjob":
        tools.search(blowjob[Math.floor(Math.random() * blowjob.length)], 'all', message, true);
        message.delete(1000);
        break;
      case "boobs":
        tools.search(boobs[Math.floor(Math.random() * boobs.length)], 'all', message, true);
        message.delete(1000);
        break;
      case "dick":
        tools.search(dick[Math.floor(Math.random() * dick.length)], 'all', message, true);
        message.delete(1000);
        break;
      case "gay":
        tools.search(gay[Math.floor(Math.random() * gay.length)], 'all', message, true);
        message.delete(1000);
        break;
      case "hardcore":
        tools.search(hardcore[Math.floor(Math.random() * hardcore.length)], 'all', message, true);
        message.delete(1000);
        break;
      case "hentai":
        tools.search(hentai[Math.floor(Math.random() * hentai.length)], 'all', message, true);
        message.delete(1000);
        break;
      case "nsfw":
        tools.search(nsfw[Math.floor(Math.random() * nsfw.length)], 'all', message, true);
        message.delete(1000);
        break;
      case "pegging":
        tools.search(pegging[Math.floor(Math.random() * pegging.length)], 'all', message, true);
        message.delete(1000);
        break;
        // rule34 code different than others
      case "rule34":
        if (!args.length) {
          tools.search(rule34[Math.floor(Math.random() * rule34.length)], 'all', message, true);
          return message.delete(1000);
        }
        tools.find(rule34[Math.floor(Math.random() * rule34.length)], args.toString().replace(' ', '+'), 'all', message, true);
        break;
      case "thighs":
        tools.search(thighs[Math.floor(Math.random() * thighs.length)], 'all', message, true);
        message.delete(1000);
        break;
      case "trap":
        tools.search(traps[Math.floor(Math.random() * traps.length)], 'all', message, true);
        message.delete(1000);
        break;
    }
  }

  client.on('message', async message => {
    //if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    /*fs.readFile('settings.json', 'utf8', (err, data) => {
      if (err) console.log(err);
      else {
        settingsData = data;
        initPrefix();
      }
    });*/
    tools.getPrefix(message.guild.id.toString(), async (prefix) => {
      if (message.content.indexOf(prefix) !== 0) return;
      const args = message.content.slice(prefix.length).split(' ');
      const command = args.shift().toLowerCase();

      fs.readFile('./commands.json', 'utf8', (err, data) => {
        if (err) return console.log(err);
        const cmds = JSON.parse(data);
        const unfilteredCmd = cmds.commands;
        let cmd = unfilteredCmd.filter(x => {
          return x != null;
        });
        var i, jsonCmd, jsonMsg;
        for (i in cmd) {
          jsonCmd = cmd[i].name;
          jsonMsg = cmd[i].message;

          if (command === jsonCmd && cmd[i].server === message.guild.id.toString()) {
            if (jsonMsg.startsWith('{module}')) {
              return tools.parseCommandModule(message, jsonMsg);
            }
            return message.channel.send(jsonMsg);
          }
        }
      });

      for (let i in othercmds) {
        const othercmd = othercmds[i];
        if (command === othercmd) {
          return handleOther(command, message, args);
        }
      }

      const comm = client.commands.get(command);
      try {
        return comm.execute(message, args, client, prefix);
      } catch (err) {
        //console.log(err);
      }
    });
  });
}