const tools = require('../tools.js');

module.exports = {
    name: 'danbooru',
    execute(message, args) {
        tools.danbooru(message);
    },
};