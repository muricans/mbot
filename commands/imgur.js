const tools = require('../tools.js');
const settings = require('../settings.json');

module.exports = {
    name: 'imgur',
    execute(message, args) {
        if (args.length === 0) {
            tools.getImage("https://api.imgur.com/3/gallery/hot/top/week?showViral=true", settings.imgurID, message);
        }
    },
};