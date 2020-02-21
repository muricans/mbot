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
        waAPI.getShort(query).then(result => message.channel.send(result))
            .catch(err => {
                if (err.toString().endsWith('No short answer available'))
                    waAPI.getFull(query).then(result => {
                        const interpreation = result.pods[0].subpods[0].plaintext;
                        const description = result.pods[1].subpods[0].plaintext.substring(0, 1777);
                        message.channel.send(`Interpreted: ${interpreation}\n${description}`);
                    }).catch(err => {
                        if (err.toString().endsWith(`Cannot read property '0' of undefined`))
                            message.channel.send('No data could be interpreted');
                        else
                            message.channel.send(`${err}`);
                    });
                else
                    message.channel.send(`${err}`);
            });
    },
};