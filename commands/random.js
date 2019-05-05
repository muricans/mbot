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
          tools.find(args[0], encoded, 'hour', message, false);
          break;
        case "day":
          tools.find(args[0], encoded, 'day', message, false);
          break;
        case "week":
          tools.find(args[0], encoded, 'week', message, false);
          break;
        case "month":
          tools.find(args[0], encoded, 'month', message, false);
          break;
        case "year":
          tools.find(args[0], encoded, 'year', message, false);
          break;
        case "all":
          tools.find(args[0], encoded, 'all', message, false);
          break;
        default:
          const noTime = args.slice(0, args.length);
          const noTimeEncoded = encodeURI(noTime.join(' '));
          tools.find(args[0], noTimeEncoded, 'day', message, false);
          break;
      }
    }
    if (args.length === 2) {
      switch (args[1]) {
        case "hour":
          tools.rSearch(args[0], 'hour', message, false);
          break;
        case "day":
          tools.rSearch(args[0], 'day', message, false);
          break;
        case "week":
          tools.rSearch(args[0], 'week', message, false);
          break;
        case "month":
          tools.rSearch(args[0], 'month', message, false);
          break;
        case "year":
          tools.rSearch(args[0], 'year', message, false);
          break;
        case "all":
          tools.rSearch(args[0], 'all', message, false);
          break;
        default:
          tools.rSearch(args[0], 'day', message, false);
          break;
      }
    }
  },
};