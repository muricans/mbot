const Discord = require('discord.js');

// 14 commands + 13 nsfw commands
// seperate admin only commands at a later time
function pageOne(edit, message) {
  const embed = new Discord.RichEmbed()
    .setTitle('Commands')
    .addField('!8ball <question>', 'Ask the bot a question')
    .addField('!create <commandName> <message>', 'Adds a command to the bot')
    .addField('!clean <@user> <messageAmount>', 'Deletes a specified amount of messages for a user [admin only]')
    .addField('!delete <commandName>', 'Deletes a command [added by !create] from the bot [admin only]')
    .addField('!echo <message>', 'Returns your message from the bot [admin only]')
    .addField('!give <@user> <points>', 'Gives a user [x] amount of points')
    .addField('!help', 'Returns a list of commands for this bot')
    .setFooter('Page (1/4)');
  if (edit) {
    return message.edit(embed);
  } else if (!edit) {
    return message.channel.send(embed);
  }
}

module.exports = {
  name: 'help',
  execute(message, args) {
    var page = 0;
    var min = 1;
    var max = 4;
    var pageNum = 'Page (' + page + '/' + max + ')';
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

        switch (page) {
          case 1:
            pageOne(true, sent);
            break;
          case 2:
            const embed2 = new Discord.RichEmbed()
              .setTitle('Commands')
              .addField('!ping', 'Returns pong')
              .addField('!points <@user>', "Returns the designated user's points")
              .addField('!random <subreddit> [time] [search]', 'Returns a random thread from a subreddit')
              .addField('!roulette <bet amount>', 'Returns win/loss and new total points')
              .addField('!roll <number>', 'Returns a random number between 1 and the chosen number')
              .addField('!userinfo <@user>', "Returns the designated user's info")
              .addField('!set <@user> points', 'Sets the users points [admin only]')
              .addField('NSFW Commands on Page 3+4', '🔞')
              .setFooter("Page (2/4)");
            //console.log(page);
            sent.edit(embed2);
            break;
          case 3:
            const embed3 = new Discord.RichEmbed()
              .setTitle('NSFW Commands')
              .addField('!anal', 'Returns an anal image')
              .addField('!ass', 'Returns an image of an ass')
              .addField('!blowjob', 'Returns a blowjob image')
              .addField('!boobs', 'Returns a picture of a pair of milkers')
              .addField('!hardcore', 'Returns a hardcore porn image')
              .addField('!hentai', 'Returns a hentai image')
              .addField('!nsfw', 'Returns an nsfw image (Straight)')
              .setFooter("Page (3/4)");
            //console.log(page);
            sent.edit(embed3);
            break;
          case 4:
            const embed4 = new Discord.RichEmbed()
              .setTitle('NSFW Commands')
              .addField('!pegging', 'Returns a pegging image')
              .addField('!rule34', 'Returns a rule34 image')
              .addField('!thighs', 'Retuns an image of thighs')
              .addField('!trap', 'Returns a trap image')
              .addField('!dick', 'Returns an image of a dick')
              .addField('!gay', 'Returns a gay porn image')
              .setFooter('Page (4/4)');
            //console.log(page);
            sent.edit(embed4);
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
  },
};
