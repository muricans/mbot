const tools = require('../tools.js');

module.exports = {
    name: 'danbooru',
    execute(message, args) {
        if (args.length === 0) {
            return tools.danbooru(message, false);
        } else {
            let searchArgs = args.join('+');
            return tools.danbooru(message, true, searchArgs);
        }
    },
};