const tools = require('../tools.js');

module.exports = {
    name: 'danbooru',
    execute(message, args) {
        return tools.danbooru(message, false);
    },
};