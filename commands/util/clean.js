module.exports = {
  name: 'clean',
  execute(message, args, client) {
    const weirdChamp = client.emojis.get("572690273247821824");
    var hasTwoArgs;

    if (args.length === 1) {
      hasTwoArgs = false;
    }

    if (args.length > 1) {
      hasTwoArgs = true;
    }

    var amnt;
    if (hasTwoArgs) {
      amnt = parseInt(args[1]);
      if (isNaN(amnt)) {
        return message.channel.send(message.author + ' Please use numbers!');
      }
    } else {
      amnt = 100;
    }
    if (amnt > 100) {
      return message.channel.send(message.author + ' Please use a number from 1-100!');
    }
    if (args.length === 0) {
      message.delete();
      return message.channel.fetchMessages().then(messages => {
        if (amnt > messages.array().size) return message.channel.send(message.author + ' Could not find that many messages!');
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

    let canDelOth = message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES");
    let hasAdmin = message.channel.permissionsFor(message.author).has("ADMINISTRATOR");
    if (!canDelOth) {
      return message.channel.send(message.author + " You don't have permission to use this command! " + weirdChamp);
    }

    if (args[0] === "all") {
      if (!hasAdmin) return message.channel.send(message.author + "You don't have perission to use this command! " + weirdChamp);
      message.delete();
      try {
        return message.channel.fetchMessages({
          limit: amnt
        }).then(messages => {
          if (amnt > messages.array().size) return message.channel.send(message.author + ' Could not find that many messages!');
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
    const mention = message.mentions.users.first();
    if (!mention) {
      return message.channel.send('That user does not exist!');
    } else {
      message.delete();
      return message.channel.fetchMessages({
        limit: amnt
      }).then(messages => {
        if (amnt > messages.array().size) return message.channel.send(message.author + ' Could not find that many messages!');
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
  let emotes = 0;
  sent.awaitReactions(reaction => {
    if (reaction.emoji.name === "❎") {
      emotes++;
    }
    switch (emotes) {
      case 2:
        sent.delete();
        break;
    }
  });
}