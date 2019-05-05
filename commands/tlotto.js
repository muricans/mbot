const tools = require('../tools.js');

module.exports = {
    name: 'tlotto',
    execute(message, args) {
        tools.webSearch("https://twitchlotto.com/", message);
    },
};