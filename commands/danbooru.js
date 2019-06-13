const tls = require('../tools.js');
const tools = new tls.Tools();

module.exports = {
    name: 'danbooru',
    usage: '[tags]',
    description: 'Returns a danbooru image [NSFW Available]',
    nsfw: true,
    execute(message, args) {
        message.delete({
            timeout: 1000,
        });
        if (args.length === 0) {
            return tools.danbooru(message);
        } else {
            const searchArgs = args.join('+');
            return tools.danbooru(message, searchArgs);
        }
    },
};