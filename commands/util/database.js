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
            case "block":
                if (!args[1]) return message.channel.send('Please add the id of the server you would like to block!');
                if (isNaN(args[1])) return message.channel.send('Please use a proper server id!');
                db.sqlite.insert('blocked(id)', [args[1]], true).then(() => {
                    message.channel.send(`Blocked server ${args[1]} successfully!`);
                }).catch((err) => {
                    console.log(err);
                    message.channel.send('Error occurred while performing task.');
                });
                break;
            case "unblock":
                if (!args[1]) return message.channel.send('Please add the id of the server you would like to unblock');
                if (isNaN(args[1])) return message.channel.send('Please use a proper server id!');
                db.sqlite.delete('blocked', `id = ${args[1]}`).then(() => {
                    message.channel.send(`Unblocked server ${args[1]} successfully!`);
                }).catch(err => {
                    console.log(err);
                    message.channel.send('Error occurred while performing task.');
                });
                break;
            default:
                message.channel.send('Unkown argument! run | get | download | block');
                break;
        }
    },
};