module.exports = {
  name: 'clean',
  execute(message, args) {
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
      amnt = 1000;
    }
    if (args.length === 0) {
      return message.channel.fetchMessages().then(messages => {
        message.delete();
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
    if (!canDelOth) {
      return message.channel.send(message.author + " You don't have permission to use this command!");
    }

    if (args[0] === "all") {
      return message.channel.fetchMessages({
        limit: amnt
      }).then(messages => {
        message.delete();
        message.channel.bulkDelete(messages).then((deleted) => {
          message.channel.send('Deleted ' + deleted.size + ' messages from this channel!').then(async sent => {
            awaitDelete(sent);
          });
        });
      });
    }
    const mention = message.mentions.users.first();
    if (!mention) {
      return message.channel.send('That user does not exist!');
    } else {
      return message.channel.fetchMessages({
        limit: amnt
      }).then(messages => {
        message.delete();
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

async function awaitDelete(sent) {
  sent.react("emojiid");
  sent.awaitReactions(reaction => {
    if(reaction.emoji.name === "emojiid") {
      sent.delete(1000);
    }
  });
}
