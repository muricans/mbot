const sqlite = require('sqlite3').verbose();
const tls = require('../../tools');
const tools = new tls.Tools();
const mbot = require('../../mbot');

const db = new sqlite.Database('./mbot.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});


module.exports = {
    name: "modules",
    usage: "<moduleName> <moduleOption> [setTo, ?name] [?setTo]",
    description: "Use modules for your server. [Documentation](https://muricans.github.io/mbot/)",
    args: true,
    minArgs: 2,
    mod: true,
    execute(message, args, client, prefix) {
        //0=moduleName
        //1=moduleOption
        //2=setTo
        const hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
        if (!hasAdmin) {
            return message.channel.send(`${message.author} You don't have permission to use this command!`);
        }
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
                            return message.reply(`${message.author} Please add params! ${prefix}modules welcomemessage edit <message>`);
                        }
                        db.run('UPDATE welcomeMessage SET message = ? WHERE id = ?', msg, message.guild.id.toString());
                        tools.addCooldown(module.exports.name, 10, message);
                        return message.channel.send(`${message.author} Set welcome message to ${msg}!`);
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
                                message.reply(`${message.author} Please add params! ${prefix}modules welcomemessage use <true|false>`);
                                break;
                        }
                        break;
                    case "channel":
                        if (!args[2]) {
                            return message.reply(`${message.author} Please add params! ${prefix}modules welcomemessage channel <channel>`);
                        }
                        const channel = message.guild.channels.find((c => c.name === args[2]));
                        if (!channel) {
                            return message.channel.send(`${message.author} That channel does not seem to exist on this server!`);
                        } else {
                            db.run(`UPDATE welcomeMessage SET channel = ? WHERE id = ?`, args[2], message.guild.id.toString());
                            tools.addCooldown(module.exports.name, 10, message);
                            return message.channel.send(`${message.author} Set the welcomemessage channel to ${args[2]}!`);
                        }
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
                            return message.reply(`${message.author} Please add params! ${prefix}modules leavemessage edit <message>`);
                        }
                        db.run('UPDATE leaveMessage SET message = ? WHERE id = ?', msg, message.guild.id.toString());
                        tools.addCooldown(module.exports.name, 10, message);
                        return message.channel.send(`${message.author} Set leave message to ${msg}!`);
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
                                message.reply(`${message.author} Please add params! ${prefix}modules leavemessage use <true|false>`);
                                break;
                        }
                        break;
                    case "channel":
                        if (!args[2]) {
                            return message.reply(`${message.author} Please add params! ${prefix}modules leavemessage channel <channel>`);
                        }
                        const channel = message.guild.channels.find((c => c.name === args[2]));
                        if (!channel) {
                            return message.channel.send(`${message.author} That channel does not seem to exist on this server!`);
                        } else {
                            db.run(`UPDATE leaveMessage SET channel = ? WHERE id = ?`, args[2], message.guild.id.toString());
                            tools.addCooldown(module.exports.name, 10, message);
                            return message.channel.send(`${message.author} Set the leavemessage channel to ${args[2]}!`);
                        }
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
                                message.reply(`${message.author} Please add params! ${prefix}modules serverinfo use <true|false>`);
                                break;
                        }
                        break;
                }
                break;
            case "commands":
                switch (args[1]) {
                    case "everyone":
                        switch (args[2]) {
                            case "true":
                                db.run('UPDATE commandOptions SET everyone = ? WHERE id = ?', 1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of allowing all users to create custom commands!`);
                                break;
                            case "false":
                                db.run('UPDATE commandOptions SET everyone = ? WHERE id = ?', 0, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Disabled use of allowing all users to create custom commands!`);
                                break;
                            default:
                                message.reply(`${message.author} Please add params! ${prefix}modules commands everyone <true|false>`);
                                break;
                        }
                        break;
                    case "use":
                        switch (args[2]) {
                            case "true":
                                db.run('UPDATE commandOptions SET use = ? WHERE id = ?', 1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of custom commands!`);
                                break;
                            case "false":
                                db.run('UPDATE commandOptions SET use = ? WHERE id = ?', 0, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Disabled use of custom commands!`);
                                break;
                            default:
                                message.reply(`${message.author} Please add params! ${prefix}modules commands use <true|false>`);
                                break;
                        }
                        break;
                    case "edit":
                        if (!args[2] || !args[3]) {
                            return message.channel.send(`${message.author} Please add params! ${prefix}modules commands edit <commandName> <newMessage>`);
                        }
                        const command = mbot.cCommands.find(c => c.name === args[2].toLowerCase() && c.id === message.guild.id);
                        if (!command) {
                            return message.channel.send(`${message.author} Could not find that command!`);
                        }
                        const msg = args.slice(3, args.length).join(' ');
                        mbot.event.emit('editCommand', command, msg);
                        db.run('UPDATE commands SET message = ? WHERE id = ? AND name = ?', msg, message.guild.id, command.name);
                        message.channel.send(`${message.author} Updated command ${command.name}'s message to ${msg}`);
                        break;
                }
                break;
            case "roles":
                switch (args[1]) {
                    case "default":
                        if (!args[2]) {
                            return message.channel.send(`${message.author} Please add params! ${prefix}modules roles default <roleName>`);
                        }
                        const findRole = args.slice(2, args.length).join(' ');
                        const role = message.guild.roles.find((r => r.name === findRole));
                        if (!role) {
                            return message.channel.send(`${message.author} Could not find that role!`);
                        }
                        db.run('UPDATE roles SET def = ? WHERE id = ?', role.name, message.guild.id);
                        tools.addCooldown(module.exports.name, 10, message);
                        message.channel.send(`${message.author} Set the default role for new users to ${role.name}!`);
                        break;
                    case "use":
                        switch (args[2]) {
                            case "true":
                                db.run('UPDATE roles SET use = ? WHERE id = ?', 1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of setting default role on new user join!`);
                                break;
                            case "false":
                                db.run('UPDATE commandOptions SET use = ? WHERE id = ?', 0, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Disabled use of setting default role on new user join!`);
                                break;
                            default:
                                message.reply(`${message.author} Please add params! ${prefix}modules roles use <true|false>`);
                                break;
                        }
                        break;
                }
                break;
            case "nsfw":
                switch (args[1]) {
                    case "use":
                        switch (args[2]) {
                            case "true":
                                db.run('UPDATE nsfw SET use = ? WHERE id = ?', 1, message.guild.id);
                                tools.addCooldown(this.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of nsfw modules!`);
                                break;
                            case "false":
                                db.run('UPDATE nsfw SET use = ? WHERE id = ?', 0, message.guild.id);
                                tools.addCooldown(this.name, 10, message);
                                message.channel.send(`${message.author} Disabled use of nsfw modules!`);
                                break;
                            default:
                                message.reply(`${message.author} Please add params! ${prefix}modules nsfw use <true|false>`);
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