const tools = require('../tools.js');

module.exports = {
  name: 'random',
  execute(message, args) {
    // 1 = subreddit
    // 2 = date
    // 3 = search
    if (!args.length) {
      return message.channel.send('Please add a subreddit');
    }
    if (args.length === 1) {
      return tools.rSearch(args, 'day', message);
    }
    // might change later
    const newArgs = args.slice(2, args.length);
    const space = newArgs.join(' ');
    const encoded = encodeURI(space);
    if (args.length > 2) {
      switch (args[1]) {
        case "hour":
          tools.find(args[0], encoded, 'hour', message);
          break;
        case "day":
          tools.find(args[0], encoded, 'day', message);
          break;
        case "week":
          tools.find(args[0], encoded, 'week', message);
          break;
        case "month":
          tools.find(args[0], encoded, 'month', message);
          break;
        case "year":
          tools.find(args[0], encoded, 'year', message);
          break;
        case "all":
          tools.find(args[0], encoded, 'all', message);
          break;
        default:
          tools.find(args[0], encoded, 'day', message);
          break;
      }
    }
    if (args.length === 2) {
      switch (args[1]) {
        case "hour":
          tools.rSearch(args[0], 'hour', message);
          break;
        case "day":
          tools.rSearch(args[0], 'day', message);
          break;
        case "week":
          tools.rSearch(args[0], 'week', message);
          break;
        case "month":
          tools.rSearch(args[0], 'month', message);
          break;
        case "year":
          tools.rSearch(args[0], 'year', message);
          break;
        case "all":
          tools.rSearch(args[0], 'all', message);
          break;
        default:
          tools.rSearch(args[0], 'day', message);
          break;
      }
    }
  },
};