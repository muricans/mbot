const tls = require('../tools.js');
const tools = new tls.Tools();

module.exports = {
    name: 'imgur',
    usage: 'No usage data.',
    description: 'Returns a random image from imgur',
    cooldown: 3,
    execute(message, args) {
        if (!args.length) {
            tools.gallery((body) => {
                message.channel.startTyping();
                const bodyData = body.data.filter(data => data.nsfw === false);
                const data = bodyData[Math.floor(Math.random() * body.data.length)];
                message.channel.send(data.link);
                message.channel.stopTyping(true);
            });
        } else {
            tools.imgur(args[0], (err, body) => {
                if (err) {
                    return message.channel.send(err);
                }
                const data = body.data;
                if (data.nsfw && message.channel.nsfw) {
                    message.channel.send(data.link);
                } else if (data.nsfw && !message.channel.nsfw) {
                    message.channel.send("Please move to an nsfw channel :flushed:");
                } else {
                    message.channel.send(data.link);
                }
            });
        }
    },
};