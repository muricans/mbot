const tools = require('../tools.js');

module.exports = {
  name: 'r34xxx',
  execute(message, args) {
    if (!message.channel.nsfw) {
      return message.channel.send("Please move to an nsfw channel :flushed:");
    }
    if (args.length === 0) {
      return tools.rule34(message);
    }
    let searchArgs = args.join('+');
    return tools.rule34Tags(searchArgs, message);
  },
};