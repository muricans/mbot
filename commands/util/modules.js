const sqlite = require('sqlite3').verbose();
const tls = require('../../tools');
const tools = new tls.Tools();

let db = new sqlite.Database('./mbot.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

module.exports = {
    name: "modules",
    usage: "<moduleName> <moduleOption> [setTo]",
    description: "Use modules for your server.",
    args: true,
    minArgs: 2,
    execute(message, args, client, prefix) {
        //0=moduleName
        //1=moduleOption
        //2=setTo
        switch (args[0].toLowerCase()) {
            case "welcomemessage":
                switch (args[1]) {
                    case "message":
                        tools.getNLMessage('welcomeMessage', message.guild.id.toString(), (use, msg) => {
                            return message.channel.send(`${message.author} ${msg}`);
                        });
                        break;
                    case "edit":
                        const msg = args.slice(2, args.length).join(' ');
                        if (!args[2]) {
                            return message.reply(`Please add params! ${prefix}modules welcomemessage edit <message>`);
                        }
                        db.run('UPDATE welcomeMessage SET message = ? WHERE id = ?', msg, message.guild.id.toString());
                        tools.addCooldown(module.exports.name, 10, message);
                        return message.channel.send(`${message.author} Set welcome message to ${msg}!`);
                        break;
                    case "use":
                        switch (args[2]) {
                            case "true":
                                db.run('UPDATE welcomeMessage SET use = ? WHERE id = ?', 1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of sending welcome messages on join!`);
                                break;
                            case "false":
                                db.run('UPDATE welcomeMessage SET use = ? WHERE id = ?', 0, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Disabled use of sending welcome messages on join!`);
                                break;
                            default:
                                message.reply(`Please add params! ${prefix}modules welcomemessage use <true|false>`);
                                break;
                        }
                        break;
                    case "channel":
                        if (!args[2]) {
                            return message.reply(`Please add params! ${prefix}modules welcomemessage channel <channel>`);
                        }
                        const channel = message.guild.channels.find((channel => channel.name === args[2]));
                        if (!channel) {
                            return message.channel.send(`${message.author} That channel does not seem to exist on this server!`);
                        } else {
                            db.run(`UPDATE welcomeMessage SET channel = ? WHERE id = ?`, args[2], message.guild.id.toString());
                            tools.addCooldown(module.exports.name, 10, message);
                            return message.channel.send(`${message.author} Set the welcomemessage channel to ${args[2]}!`);
                        }
                        break;
                }
                break;
            case "leavemessage":
                switch (args[1]) {
                    case "message":
                        tools.getNLMessage('leaveMessage', message.guild.id.toString(), (use, msg) => {
                            return message.channel.send(`${message.author} ${msg}`);
                        });
                        break;
                    case "edit":
                        const msg = args.slice(2, args.length).join(' ');
                        if (!args[2]) {
                            return message.reply(`Please add params! ${prefix}modules leavemessage edit <message>`);
                        }
                        db.run('UPDATE leaveMessage SET message = ? WHERE id = ?', msg, message.guild.id.toString());
                        tools.addCooldown(module.exports.name, 10, message);
                        return message.channel.send(`${message.author} Set leave message to ${msg}!`);
                        break;
                    case "use":
                        switch (args[2]) {
                            case "true":
                                db.run('UPDATE leaveMessage SET use = ? WHERE id = ?', 1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of sending leave messages on leave!`);
                                break;
                            case "false":
                                db.run('UPDATE leaveMessage SET use = ? WHERE id = ?', 0, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Disabled use of sending leave messages on leave!`);
                                break;
                            default:
                                message.reply(`Please add params! ${prefix}modules leavemessage use <true|false>`);
                                break;
                        }
                        break;
                    case "channel":
                        if (!args[2]) {
                            return message.reply(`Please add params! ${prefix}modules leavemessage channel <channel>`);
                        }
                        const channel = message.guild.channels.find((channel => channel.name === args[2]));
                        if (!channel) {
                            return message.channel.send(`${message.author} That channel does not seem to exist on this server!`);
                        } else {
                            db.run(`UPDATE leaveMessage SET channel = ? WHERE id = ?`, args[2], message.guild.id.toString());
                            tools.addCooldown(module.exports.name, 10, message);
                            return message.channel.send(`${message.author} Set the leavemessage channel to ${args[2]}!`);
                        }
                        break;
                }
                break;
            case "serverinfo":
                switch (args[1]) {
                    case "use":
                        switch (args[2]) {
                            case "true":
                                db.run('UPDATE serverInfo SET use = ? WHERE id = ?', 1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of serverinfo command!`);
                                break;
                            case "false":
                                db.run('UPDATE serverInfo SET use = ? WHERE id = ?', 0, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Disabled use of serverinfo commnad!`);
                                break;
                            default:
                                message.reply(`Please add params! ${prefix}modules serverinfo use <true|false>`);
                                break;
                        }
                        break;
                }
                break;
            default:
                message.reply('Could not find that module!');
                break;
        }

    },
};