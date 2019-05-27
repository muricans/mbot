const tls = require('../tools.js');
const tools = new tls.Tools();

module.exports = {
    name: 'imgur',
    usage: 'No usage data.',
    description: 'Returns a random image from imgur',
    cooldown: 3,
    execute(message) {
        tools.imgur((body) => {
            message.channel.startTyping();
            const bodyData = body.data.filter(data => data.nsfw === false);
            const data = bodyData[Math.floor(Math.random() * body.data.length)];
            message.channel.send(data.link);
            message.channel.stopTyping(true);
        });
    },
};