const tools = require('../tools.js');

module.exports = {
    name: 'imgur',
    execute(message, args) {
        if (args.length === 0) {
            tools.webSearch("https://api.imgur.com/3/gallery/hot/top/week?showViral=true", message);
        }
    },
};