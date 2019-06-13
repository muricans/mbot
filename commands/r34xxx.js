const tls = require('../tools.js');
const tools = new tls.Tools();

module.exports = {
  name: 'r34xxx',
  usage: '[tags]',
  description: 'Returns an image from rule34',
  nsfw: true,
  execute(message, args) {
    message.delete({
      timeout: 1000,
    });
    if (!message.channel.nsfw) {
      return message.channel.send("Please move to an nsfw channel :flushed:");
    }
    if (args.length === 0) {
      return tools.rule34(message);
    }
    const searchArgs = args.join('+');
    return tools.rule34(message, searchArgs);
  },
};