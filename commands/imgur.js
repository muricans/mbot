const tools = require('../tools.js');
const settings = require('../settings.json');

module.exports = {
    name: 'imgur',
    execute(message, args) {
        if (args.length === 0) {
            tools.getImage("/3/gallery/hot/top/week?showViral=true/0.json", settings.imgurID, message);
        }
    },
};