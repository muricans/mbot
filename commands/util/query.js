const settings = require('../../settings.json');
const key = settings.wolframAPIKey;
const WolframAlphaAPI = require('wolfram-alpha-api');
const waAPI = WolframAlphaAPI(key);

module.exports = {
    name: 'query',
    usage: '<query>',
    description: 'Query information by utilizing Wolfram',
    args: true,
    minArgs: 1,
    execute(message, args) {
        const query = args.slice(0, args.length).join(' ');
        waAPI.getShort(query).then(val => {
            message.channel.send(val);
        }).catch(err => message.channel.send(`${err}`));
    },
};