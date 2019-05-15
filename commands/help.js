const Discord = require('discord.js');
const fs = require('fs');

// 16 commands + [5 admin only commands] + 14 nsfw commands
// seperate admin only commands at a later time
const min = 1;
const max = 5;

function pageOne(edit, message) {
  let stngs = fs.readFileSync('settings.json', 'utf8');
  let settings = JSON.parse(stngs);
  const prefix = settings.prefix;
  const embed = new Discord.RichEmbed()
    .setTitle('Commands')
    .addField(prefix + '8ball <question>', 'Ask the bot a question')
    .addField(prefix + 'create <commandName> <message>', 'Adds a command to the bot')
    .addField(prefix + 'clean <@user> <messageAmount>', 'Deletes a specified amount of messages for a user [admin only]')
    .addField(prefix + 'danbooru', 'Returns a danbooru image [NSFW Available]')
    .addField(prefix + 'delete <commandName>', 'Deletes a command [added by !create] from the bot [admin only]')
    .addField(prefix + 'echo <message>', 'Returns your message from the bot [admin only]')
    .addField(prefix + 'give <@user> <points>', 'Gives a user [x] amount of points')
    .setFooter('Page (1/' + max + ')');
  if (edit) {
    return message.edit(embed);
  } else if (!edit) {
    return message.channel.send(embed);
  }
}

module.exports = {
  name: 'help',
  usage: '[command]',
  description: 'Gives you a list of help commands, or info on a specified command.',
  execute(message, args, client) {
    let stngs = fs.readFileSync('settings.json', 'utf8');
    let settings = JSON.parse(stngs);
    const prefix = settings.prefix;
    if (args.length === 0) {
      let page = 0;
      pageOne(false, message).then(async sent => {
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

          let pageData = 'Page (' + page + '/' + max + ')';

          switch (page) {
            case 1:
              pageOne(true, sent);
              break;
            case 2:
              const embed2 = new Discord.RichEmbed()
                .setTitle('Commands')
                .addField(prefix + 'help', 'Returns a list of commands for this bot')
                .addField(prefix + 'imgur', 'Returns a random image from imgur')
                .addField(prefix + 'meme', 'Returns a random meme')
                .addField(prefix + 'ping', 'Returns pong')
                .addField(prefix + 'prefix <newPrefix>', 'Changes the bots prefix [admin only]')
                .addField(prefix + 'points <@user>', "Returns the designated user's points")
                .addField(prefix + 'qr <information>', 'Returns a QR code with the designated information')
                .setFooter(pageData);
              //console.log(page);
              sent.edit(embed2);
              break;
            case 3:
              const embed3 = new Discord.RichEmbed()
                .setTitle('NSFW Commands')
                .addField(prefix + 'random <subreddit> [time] [search]', 'Returns a random thread from a subreddit')
                .addField(prefix + 'roulette <bet amount>', 'Returns win/loss and new total points')
                .addField(prefix + 'roll <number>', 'Returns a random number between 1 and the chosen number')
                .addField(prefix + 'suggest <suggestion>', 'Suggest a command or feature for the bot')
                .addField(prefix + 'suggestions', 'Check the suggestions, (include <clear> [admin only] to clear the suggestions)')
                .addField(prefix + 'userinfo <@user>', "Returns the designated user's info")
                .addField(prefix + 'set <@user> points', 'Sets the users points [admin only]')
                .addField('NSFW Commands on Page 4+5', '🔞')
                .setFooter(pageData);
              //console.log(page);
              sent.edit(embed3);
              break;
            case 4:
              const embed4 = new Discord.RichEmbed()
                .setTitle('NSFW Commands')
                .addField(prefix + 'anal', 'Returns an anal image')
                .addField(prefix + 'ass', 'Returns an image of an ass')
                .addField(prefix + 'blowjob', 'Returns a blowjob image')
                .addField(prefix + 'boobs', 'Returns a picture of a pair of milkers')
                .addField(prefix + 'hardcore', 'Returns a hardcore porn image')
                .addField(prefix + 'hentai', 'Returns a hentai image')
                .addField(prefix + 'nsfw', 'Returns an nsfw image (Straight)')
                .setFooter(pageData);
              //console.log(page);
              sent.edit(embed4);
              break;
            case 5:
              const embed5 = new Discord.RichEmbed()
                .setTitle('NSFW Commands')
                .addField(prefix + 'pegging', 'Returns a pegging image')
                .addField(prefix + 'r34xxx', 'Returns an image from rule34')
                .addField(prefix + 'rule34', 'Returns a rule34 image from reddit')
                .addField(prefix + 'thighs', 'Retuns an image of thighs')
                .addField(prefix + 'trap', 'Returns a trap image')
                .addField(prefix + 'dick', 'Returns an image of a dick')
                .addField(prefix + 'gay', 'Returns a gay porn image')
                .setFooter(pageData);
              //console.log(page);
              sent.edit(embed5);
              break;
          }


          if (page > max) {
            page = max;
          }

          if (page < min) {
            page = min;
          }
        }, {
          time: 20000
        });
      });
      return;
    }
    const cmd = client.commands.get(args[0].toLowerCase());
    if (!cmd) {
      return message.channel.send(message.author + ' That command does not exist!');
    }
    const {
      usage,
      description,
      name
    } = cmd;
    const desc = description || "No description defined.";
    if (usage) {
      const embed = new Discord.RichEmbed()
        .setTitle(prefix + name)
        .addField('Usage ', usage)
        .addField('Description', desc);
      return message.channel.send(embed);
    } else {
      return message.channel.send(message.author + ' No usage data foud for that command!');
    }

  },
};