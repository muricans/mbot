const settings = require('./settings.json');
const tools = require('./tools.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.registerCommands = function(client) {
  client.commands = new Discord.Collection();
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const cmd = require(`./commands/${file}`);
    client.commands.set(cmd.name, cmd);
  }
  client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.content.indexOf(settings.prefix) !== 0) return;
    const args = message.content.slice(settings.prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    let hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");

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


    var anal = ['anal', 'analgw', 'painal'];
    var ass = ['ass', 'bigasses', 'assinthong', 'buttplug', 'booty', 'paag', 'hungrybutts', 'slimthick', 'assholebehindthong'];
    var blowjob = ['blowjobs', 'deepthroat', 'facefuck'];
    var boobs = ['boobies', 'boobs', 'boobbounce'];
    var dick = ['bulges', 'cock', 'dickpics4freedom', 'massivecock', 'penis', 'thickdick'];
    var gay = ['broslikeus', 'gaybrosgonewild', 'gaygifs', 'gayporn', 'ladybonersgw', 'men2men', 'TotallyStraight', 'twinks'];
    var hardcore = ['nsfwhardcore', 'shelikesitrough'];
    var hentai = ['hentai', 'sportshentai', 'ecchi', 'hentai_gif', 'thighdeology', 'westernhentai'];
    var nsfw = ['nsfw_gif', 'nsfw', 'asiansgonewild', 'asianhotties', 'asiannsfw', 'porninfifteenseconds'];
    var pegging = ['pegging'];
    var rule34 = ['rule34', 'rule34lol', 'dbdgonewild', 'rule34rainbowsix', '2booty'];
    var thighs = ['datgap', 'thighhighs'];
    var traps = ['futanari', 'traps', 'traphentai', 'delicioustraps'];

    // commands here

    if (command === 'ping') {
      message.reply('pong');
    }

    switch (command) {
      case "help":
        client.commands.get('help').execute(message, args);
        break;
      case "userinfo":
        client.commands.get('userinfo').execute(message, args);
        break;
      case "random":
        client.commands.get('random').execute(message, args);
        break;
      case "roulette":
        client.commands.get('roulette').execute(message, args, client);
        break;
      case "points":
        client.commands.get('points').execute(message, args);
        break;
      case "give":
        client.commands.get('give').execute(message, args);
        break;
      case "set":
        client.commands.get('set').execute(message, args);
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