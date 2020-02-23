const settings = require('../../settings.json');
const key = settings.wolframAPIKey;
const WolframAlphaAPI = require('wolfram-alpha-api');
const waAPI = WolframAlphaAPI(key);

module.exports = {
    name: 'query',
    usage: '[$full] <query>',
    description: 'Query information by utilizing Wolfram | Add $full before query to force a full response',
    args: true,
    minArgs: 1,
    execute(message, args) {
        if (args[0] == '$full' && args.length > 1)
            getFull(args.slice(1, args.length).join(' ')).then(result => message.channel.send(result));
        else {
            const query = args.join(' ');
            waAPI.getShort(query).then(result => message.channel.send(result))
                .catch(err => {
                    if (err.toString().endsWith('No short answer available'))
                        getFull(query).then(result => message.channel.send(result));
                    else
                        message.channel.send(`${err}`);
                });
        }
    },
};

function getFull(query) {
    return new Promise(resolve => {
        waAPI.getFull(query).then(result => {
            const interp = result.pods[0].subpods[0].plaintext;
            const desc = result.pods[1].subpods[0].plaintext.substring(0, 1777);
            resolve(`Interpreted: ${interp}\n${desc}`);
        }).catch(err => {
            if (err.toString().endsWith(`Cannot read property '0' of undefined`))
                resolve('No data could be interpreted');
            else
                resolve(`${err}`);
        });
    });
}