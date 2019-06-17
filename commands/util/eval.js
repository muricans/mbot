const {
    Tools,
} = require('../../tools');
const tools = new Tools();

module.exports = {
    name: 'eval',
    usage: '<code>',
    description: 'Run code [OWNER ONLY]',
    owner: true,
    args: true,
    minArgs: 1,
    execute(message, args, client, prefix, db, n) {
        try {
            let toRun = eval(args.join(' '));
            if (typeof toRun !== "string")
                toRun = require('util').inspect(toRun);
            const cleaned = clean(toRun);
            if (cleaned.length > 2000)
                return message.channel.send(`Result has \`${cleaned.length}\` chars.\nType \`dump\` to dump result anyway.`)
                    .then(sent => {
                        const collector = sent.channel.createMessageCollector((msg => msg.author.id === message.author.id && msg.content.toLowerCase() === 'dump'), {
                            time: 10000,
                        });
                        collector.on('collect', () => {
                            const repeat = Math.floor(cleaned.length / 1800);
                            let multiplier = 1;

                            for (let i = 0; i < repeat * multiplier; i++) {
                                if (i === repeat + 1) break;
                                sent.channel.send(cleaned.slice(((multiplier - 1) * 1800), (multiplier * 1800)), {
                                    code: "javascript",
                                });
                                multiplier++;
                            }
                            collector.stop();
                        });
                    });
            message.channel.send(cleaned, {
                code: "javascript",
            });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    },
};

function clean(text) {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}