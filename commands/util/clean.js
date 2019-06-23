const {
  Tools,
} = require('../../tools');
const tools = new Tools();

module.exports = {
  name: 'clean',
  usage: '[user|all] [number]',
  description: 'Deletes a specified amount of messages for a user [admin only]',
  cooldown: 1,
  mod: true,
  permissions: ['MANAGE_MESSAGES'],
  execute(message, args, client) {
    const weirdChamp = client.emojis.get("572690273247821824");
    let hasTwoArgs;
    if (args.length === 1) {
      hasTwoArgs = false;
    }
    if (args.length > 1) {
      hasTwoArgs = true;
    }
    const hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    const canDelOthBot = message.channel.permissionsFor(message.guild.member(client.user)).has("MANAGE_MESSAGES");
    const hasAdminBot = message.channel.permissionsFor(message.guild.member(client.user)).has("ADMINISTRATOR");
    if (!canDelOthBot || !hasAdminBot) {
      return message.channel.send('The bot does not have permission to do this.');
    }

    let amnt;
    if (hasTwoArgs) {
      amnt = parseInt(args[1]);
      if (isNaN(amnt)) {
        return message.channel.send(`${message.author} Please use numbers!`);
      }
    } else {
      amnt = 100;
    }
    if (amnt > 100) {
      return message.channel.send(`${message.author} Please use a number from 1-100!`);
    }
    if (args.length === 0) {
      message.delete();
      return message.channel.messages.fetch().then(messages => {
        if (amnt > messages.array().size) return message.channel.send(`${message.author} Could not find that many messages!`);
        const authMessages = messages.filter(msg => {
          return msg.author.equals(message.author);
        });
        message.channel.bulkDelete(authMessages).then((deleted) => {
          message.channel.send('Deleted ' + deleted.size + ' messages from user ' + message.author.username + '!').then(async sent => {
            awaitDelete(sent);
          });
        });
      });
    }

    if (args[0] === "all") {
      if (!hasAdmin) return message.channel.send(`${message.author} You don't have perission to use this command! ${weirdChamp}`);
      message.delete();
      try {
        return message.channel.messages.fetch({
          limit: amnt,
        }).then(messages => {
          if (amnt > messages.array().size) return message.channel.send(`${message.author}` + ' Could not find that many messages!');
          message.channel.bulkDelete(messages).then((deleted) => {
            message.channel.send('Deleted ' + deleted.size + ' messages from this channel!').then(async sent => {
              awaitDelete(sent);
            });
          });
        });
      } catch (err) {
        return message.channel.send('There were no messages found in this channel!');
      }
    }
    const mention = tools.parseMention(args[0], client);
    if (!mention) {
      return message.channel.send('That user does not exist!');
    } else {
      message.delete();
      return message.channel.messages.fetch({
        limit: amnt,
      }).then(messages => {
        if (amnt > messages.array().size) return message.channel.send(`${message.author} Could not find that many messages!`);
        const mentionMessages = messages.filter(msg => {
          return msg.author.equals(mention);
        });
        message.channel.bulkDelete(mentionMessages).then((deleted) => {
          message.channel.send('Deleted ' + deleted.size + ' messages from user ' + mention.username + '!').then(async sent => {
            awaitDelete(sent);
          });
        });
      });
    }
  },
};

//delete emote
async function awaitDelete(sent) {
  sent.react("❎");
  sent.awaitReactions((reaction, user) => {
    if (user.bot) return;
    if (reaction.emoji.name === "❎") {
      sent.delete();
    }
  }, {
    time: 20000,
  });
}