const tools = require('./tools.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.registerCommands = function (client) {
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
  client.on('message', async message => {
    //if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    let stngs = fs.readFileSync('settings.json', 'utf8');
    let settings = JSON.parse(stngs);
    const prefix = settings.prefix;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(settings.prefix.length).split(' ');
    const command = args.shift().toLowerCase();

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

    // commands here

    const ppHop = client.emojis.get("572687346529468428");
    if (command === 'ping') {
      message.reply('pong ' + ppHop);
    }


    const data = fs.readFileSync('commands.json', 'utf8');
    const cmds = JSON.parse(data);
    const unfilteredCmd = cmds.commands;
    const cmd = unfilteredCmd.filter(x => {
      return x != null;
    });
    var i, jsonCmd, jsonMsg;
    for (i in cmd) {
      jsonCmd = cmd[i].name;
      jsonMsg = cmd[i].message;

      if (command === jsonCmd) {
        message.channel.send(jsonMsg);
      }
    }
    switch (command) {
      case "8ball":
        client.commands.get('8ball').execute(message, args, client);
        break;
      case "clean":
        client.commands.get('clean').execute(message, args, client);
        break;
      case "create":
        client.commands.get('create').execute(message, args);
        break;
      case "delete":
        client.commands.get('delete').execute(message, args, client);
        break;
      case "echo":
        client.commands.get('echo').execute(message, args, client);
        break;
      case "give":
        client.commands.get('give').execute(message, args);
        break;
      case "help":
        client.commands.get('help').execute(message, args);
        break;
      case "prefix":
        client.commands.get('prefix').execute(message, args, client);
        break;
      case "points":
        client.commands.get('points').execute(message, args);
        break;
      case "random":
        client.commands.get('random').execute(message, args);
        break;
      case "roll":
        client.commands.get('roll').execute(message, args);
        break;
      case "roulette":
        client.commands.get('roulette').execute(message, args, client);
        break;
      case "set":
        client.commands.get('set').execute(message, args, client);
        break;
      case "userinfo":
        client.commands.get('userinfo').execute(message, args, client);
        break;
      case "qr":
        client.commands.get('qr').execute(message, args);
        break;

        /*case "hey": only reason why checking if bot is needed.
          message.channel.send('!hey');
          break;*/


      case "meme":
        tools.search(meme[Math.floor(Math.random() * meme.length)], 'all', message);
        message.delete(1000);
        break;


        // porn commands

      case "anal":
        tools.search(anal[Math.floor(Math.random() * anal.length)], 'all', message);
        message.delete(1000);
        break;
      case "ass":
        tools.search(ass[Math.floor(Math.random() * ass.length)], 'all', message);
        message.delete(1000);
        break;
      case "blowjob":
        tools.search(blowjob[Math.floor(Math.random() * blowjob.length)], 'all', message);
        message.delete(1000);
        break;
      case "boobs":
        tools.search(boobs[Math.floor(Math.random() * boobs.length)], 'all', message);
        message.delete(1000);
        break;
      case "dick":
        tools.search(dick[Math.floor(Math.random() * dick.length)], 'all', message);
        message.delete(1000);
        break;
      case "gay":
        tools.search(gay[Math.floor(Math.random() * gay.length)], 'all', message);
        message.delete(1000);
        break;
      case "hardcore":
        tools.search(hardcore[Math.floor(Math.random() * hardcore.length)], 'all', message);
        message.delete(1000);
        break;
      case "hentai":
        tools.search(hentai[Math.floor(Math.random() * hentai.length)], 'all', message);
        message.delete(1000);
        break;
      case "nsfw":
        tools.search(nsfw[Math.floor(Math.random() * nsfw.length)], 'all', message);
        message.delete(1000);
        break;
      case "pegging":
        tools.search(pegging[Math.floor(Math.random() * pegging.length)], 'all', message);
        message.delete(1000);
        break;
        // rule34 code different than others
      case "rule34":
        if (!args.length) {
          tools.search(rule34[Math.floor(Math.random() * rule34.length)], 'all', message);
          return message.delete(1000);
        }
        tools.find(rule34[Math.floor(Math.random() * rule34.length)], args.toString().replace(' ', '+'), 'all', message);
        break;
      case "thighs":
        tools.search(thighs[Math.floor(Math.random() * thighs.length)], 'all', message);
        message.delete(1000);
        break;
      case "trap":
        tools.search(traps[Math.floor(Math.random() * traps.length)], 'all', message);
        message.delete(1000);
        break;

    }


  });
}