const tls = require('../tools.js');
const tools = new tls.Tools();

module.exports = {
    name: 'imgur',
    usage: 'No usage data.',
    description: 'Returns a random image from imgur',
    cooldown: 3,
    execute(message, args) {
        if (args.length === 0) {
            tools.getImage(message);
        }
    },
};