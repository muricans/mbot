const tools = require('../tools.js');

module.exports = {
    name: 'danbooru',
    usage: '[tags]',
    description: 'Returns a danbooru image [NSFW Available]',
    execute(message, args) {
        message.delete(1000);
        if (args.length === 0) {
            return tools.danbooru(message, false);
        } else {
            let searchArgs = args.join('+');
            return tools.danbooru(message, true, searchArgs);
        }
    },
};