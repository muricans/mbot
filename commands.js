const settings = require('./settings.json');
const tools = require('./tools.js');
const Discord = require('discord.js');

module.exports.registerCommands = function(client) {
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
        }, {});
      });
    }

    let rule34 = ['rule34', 'rule34lol', 'dbdgonewild', 'rule34rainbowsix', '2booty'];
    var gay = ['broslikeus', 'gaybrosgonewild', 'gaygifs', 'gayporn', 'ladybonersgw', 'men2men', 'TotallyStraight', 'twinks'];
    var hentai = ['hentai', 'sportshentai', 'ecchi', 'hentai_gif', 'thighdeology', 'westernhentai'];
    var traps = ['futanari', 'traps', 'traphentai', 'delicioustraps'];
    var dick = ['bulges', 'cock', 'dickpics4freedom', 'massivecock', 'penis', 'thickdick'];
    var ass = ['ass', 'bigasses', 'assinthong', 'buttplug', 'booty', 'paag', 'hungrybutts', 'slimthick', 'assholebehindthong'];
    var nsfw = ['nsfw_gif', 'nsfw', 'asiansgonewild', 'asianhotties', 'asiannsfw', 'porninfifteenseconds'];
    var blowjob = ['blowjobs', 'deepthroat', 'facefuck'];
    var anal = ['anal', 'analgw', 'painal'];
    var boobs = ['boobies', 'boobs', 'boobbounce'];
    var thighs = ['datgap', 'thighhighs'];
    var hardcore = ['nsfwhardcore', 'shelikesitrough'];
    var pegging = ['pegging'];

    const errMsg = "Please move to an nsfw channel :flushed:";

    // commands here

    if (command === 'ping') {
      message.reply('pong');
    }

    if (command === 'userinfo') {
      let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setDescription('User info is being displayed.')
        .addField('Full Username', `${message.author.username}#${message.author.discriminator}`)
        .addField('ID', message.author.id)
        .addField('Time of Creation', message.author.createdAt)
        .addField('Avatar URL', message.author.avatarURL);
      message.channel.send(embed);
    }


    if (command === "random") {
      if (!args.length) {
        return message.channel.send('Please add a subreddit');
      }
      tools.search(args, 'all', message);
    }

    switch (command) {
      case "help":
        var page = 0;
        var min = 1;
        var max = 3;
        const embed = new Discord.RichEmbed()
          .setTitle('Commands')
          .addField('!help', 'Returns a list of commands for this bot')
          .addField('!ping', 'Returns pong')
          .addField('!userinfo', 'Returns userinfo about yourself')
          .addField('!random <subreddit>', 'Returns a random thread from a subreddit')
          .addField('!rule34', 'Returns a rule34 image')
          .addField('!nsfw', 'Returns an nsfw image (Straight)')
          .addField('!gay', 'Returns a gay porn image')
          .addField('!hentai', 'Returns a hentai image')
          .setFooter('Requested by: ' + message.author.username + " (1/3)");
        //console.log(page);
        message.channel.send(embed).then(async sent => {
          await sent.react("◀");
          await sent.react("▶");
          sent.awaitReactions(reaction => {
            if (reaction.emoji.name === "◀") {
              reaction.remove(message.author);
              page--;
            } else if (reaction.emoji.name === "▶") {
              reaction.remove(message.author);
              page++;
            }

            switch (page) {
              case 1:
                const embed1 = new Discord.RichEmbed()
                  .setTitle('Commands')
                  .addField('!help', 'Returns a list of commands for this bot')
                  .addField('!ping', 'Returns pong')
                  .addField('!userinfo', 'Returns userinfo about yourself')
                  .addField('!random <subreddit>', 'Returns a random thread from a subreddit')
                  .addField('!rule34', 'Returns a rule34 image')
                  .addField('!nsfw', 'Returns an nsfw image (Straight)')
                  .addField('!gay', 'Returns a gay porn image')
                  .addField('!hentai', 'Returns a hentai image')
                  .setFooter('Requested by: ' + message.author.username + " (1/3)");
                //console.log(page);
                sent.edit(embed1);
                break;
              case 2:
                const embed2 = new Discord.RichEmbed()
                  .setTitle('Commands')
                  .addField('!trap', 'Returns a trap image')
                  .addField('!dick', 'Returns an image of a dick')
                  .addField('!ass', 'Returns an image of an ass')
                  .addField('!blowjob', 'Returns a blowjob image')
                  .addField('!anal', 'Returns an anal image')
                  .addField('!boobs', 'Returns a picture of a pair of milkers')
                  .addField('!thighs', 'Retuns an image of thighs')
                  .addField('!hardcore', 'Returns a hardcore porn image')
                  .addField('!pegging', 'Returns a pegging image')
                  .setFooter('Requested by: ' + message.author.username + " (2/3)");
                //console.log(page);
                sent.edit(embed2);
                break;
              case 3:
                const embed3 = new Discord.RichEmbed()
                  .setTitle('Commands')
                  .addField('!test', 'A test command')
                  .setFooter('Requested by: ' + message.author.username + " (3/3)");
                //console.log(page);
                sent.edit(embed3);
                break;
            }

            if (page > max) {
              page = 3;
            }

            if (page < min) {
              page = 1;
            }
          }, {
            time: 20000
          });
        });
        break;
      case "rule34":
        tools.search(rule34[Math.floor(Math.random() * rule34.length)], 'all', message);
        message.delete(1000);
        break;
      case "hentai":
        tools.search(hentai[Math.floor(Math.random() * hentai.length)], 'all', message);
        message.delete(1000);
        break;
      case "trap":
        tools.search(traps[Math.floor(Math.random() * traps.length)], 'all', message);
        message.delete(1000);
        break;
      case "gay":
        tools.search(gay[Math.floor(Math.random() * gay.length)], 'all', message);
        message.delete(1000);
        break;
      case "dick":
        tools.search(dick[Math.floor(Math.random() * dick.length)], 'all', message);
        message.delete(1000);
        break;
      case "boobs":
        tools.search(boobs[Math.floor(Math.random() * boobs.length)], 'all', message);
        message.delete(1000);
        break;
      case "nsfw":
        tools.search(nsfw[Math.floor(Math.random() * nsfw.length)], 'all', message);
        message.delete(1000);
        break;
      case "blowjob":
        tools.search(blowjob[Math.floor(Math.random() * blowjob.length)], 'all', message);
        message.delete(1000);
        break;
      case "anal":
        tools.search(anal[Math.floor(Math.random() * anal.length)], 'all', message);
        message.delete(1000);
        break;
      case "thighs":
        tools.search(thighs[Math.floor(Math.random() * thighs.length)], 'all', message);
        message.delete(1000);
        break;
      case "hardcore":
        tools.search(hardcore[Math.floor(Math.random() * hardcore.length)], 'all', message);
        message.delete(1000);
        break;
      case "pegging":
        tools.search(pegging[Math.floor(Math.random() * pegging.length)], 'all', message);
        message.delete(1000);
        break;
      case "ass":
        tools.search(ass[Math.floor(Math.random() * ass.length)], 'all', message);
        message.delete(1000);
        break;

    }


  });
}