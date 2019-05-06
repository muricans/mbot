const tools = require('../tools.js');

module.exports = {
  name: 'r34xxx',
  execute(message, args) {
    message.delete(500);
    if (!message.channel.nsfw) {
      return message.channel.send("Please move to an nsfw channel :flushed:");
    }
    if (args.length === 0) {
      return tools.rule34(message, false);
    }
    let searchArgs = args.join('+');
    return tools.rule34Tags(message, true, searchArgs);
  },
};