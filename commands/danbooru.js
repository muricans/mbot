const tools = require('../tools.js');

module.exports = {
    name: 'danbooru',
    execute(message, args) {
        const channelNsfw = !message.channel.nsfw;
        if (args.length === 0) {
            return tools.danbooru(message, channelNsfw, false);
        }
        let searchArgs = args.join('+');
        return tools.danbooru(message, channelNsfw, true, searchArgs);
    },
};