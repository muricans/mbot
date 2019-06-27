const Discord = require('discord.js');

module.exports = {
    name: 'database',
    usage: '<run|get|download>',
    description: 'Manage mbot database',
    args: true,
    minArgs: 1,
    owner: true,
    mod: true,
    execute(message, args, client, prefix, db) {
        switch (args[0]) {
            case "run":
                const toRun = args.slice(1, args.length).join(' ');
                if (!toRun.length) return message.channel.send('Please add a statement to run!');
                try {
                    db.prepare(toRun).run();
                } catch (err) {
                    message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
                }
                break;
            case "get":
                const toGet = args.slice(1, args.length).join(' ');
                if (!toRun.length) return message.channel.send('Please add a statement to get!');
                try {
                    db.prepare(toGet).get();
                } catch (err) {
                    message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
                }
                break;
            case "download":
                message.channel.send(new Discord.MessageAttachment('mbot.db'));
                break;
        }
    },
};