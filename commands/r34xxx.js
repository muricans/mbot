const tools = require('../tools.js');

module.exports = {
  name: 'r34xxx',
  execute(message, args) {
    if (args.length === 0) {
      return tools.rule34(message);
    }
    let searchArgs = args.join('+');
    return tools.rule34Tags(searchArgs, message);
  },
};