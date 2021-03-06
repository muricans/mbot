const tls = require('../../tools');
const tools = new tls.Tools();
const mbot = require('../../mbot');

module.exports = {
    name: "modules",
    usage: "<moduleName> <moduleOption> [setTo, ?name] [?setTo]",
    description: "Use modules for your server. [Documentation](https://muricans.github.io/mbot/)",
    args: true,
    minArgs: 2,
    mod: true,
    permissions: ['ADMINISTRATOR'],
    execute(message, args, client, prefix, db) {
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
                            return message.reply(`${message.author} Please add params! ${prefix}modules welcomemessage edit <message>`);
                        }
                        db.prepare('UPDATE welcomeMessage SET message = ? WHERE id = ?').run(msg, message.guild.id.toString());
                        tools.addCooldown(module.exports.name, 10, message);
                        return message.channel.send(`${message.author} Set welcome message to ${msg}!`);
                    case "use":
                        switch (args[2]) {
                            case "true":
                                db.prepare('UPDATE welcomeMessage SET use = ? WHERE id = ?').run(1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of sending welcome messages on join!`);
                                break;
                            case "false":
                                db.prepare('UPDATE welcomeMessage SET use = ? WHERE id = ?').run(0, message.guild.id.toString());
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
                            db.prepare(`UPDATE welcomeMessage SET channel = ? WHERE id = ?`).run(args[2], message.guild.id.toString());
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
                        db.prepare('UPDATE leaveMessage SET message = ? WHERE id = ?').run(msg, message.guild.id.toString());
                        tools.addCooldown(module.exports.name, 10, message);
                        return message.channel.send(`${message.author} Set leave message to ${msg}!`);
                    case "use":
                        switch (args[2]) {
                            case "true":
                                db.prepare('UPDATE leaveMessage SET use = ? WHERE id = ?').run(1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of sending leave messages on leave!`);
                                break;
                            case "false":
                                db.prepare('UPDATE leaveMessage SET use = ? WHERE id = ?').run(0, message.guild.id.toString());
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
                            db.prepare(`UPDATE leaveMessage SET channel = ? WHERE id = ?`).run(args[2], message.guild.id.toString());
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
                                db.prepare('UPDATE serverInfo SET use = ? WHERE id = ?').run(1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of serverinfo command!`);
                                break;
                            case "false":
                                db.prepare('UPDATE serverInfo SET use = ? WHERE id = ?').run(0, message.guild.id.toString());
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
                                db.prepare('UPDATE commandOptions SET everyone = ? WHERE id = ?').run(1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of allowing all users to create custom commands!`);
                                break;
                            case "false":
                                db.prepare('UPDATE commandOptions SET everyone = ? WHERE id = ?').run(0, message.guild.id.toString());
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
                                db.prepare('UPDATE commandOptions SET use = ? WHERE id = ?').run(1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of custom commands!`);
                                break;
                            case "false":
                                db.prepare('UPDATE commandOptions SET use = ? WHERE id = ?').run(0, message.guild.id.toString());
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
                        db.prepare('UPDATE commands SET message = ? WHERE id = ? AND name = ?').run(msg, message.guild.id, command.name);
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
                        db.prepare('UPDATE roles SET def = ? WHERE id = ?').run(role.name, message.guild.id);
                        tools.addCooldown(module.exports.name, 10, message);
                        message.channel.send(`${message.author} Set the default role for new users to ${role.name}!`);
                        break;
                    case "use":
                        switch (args[2]) {
                            case "true":
                                db.prepare('UPDATE roles SET use = ? WHERE id = ?').run(1, message.guild.id.toString());
                                tools.addCooldown(module.exports.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of setting default role on new user join!`);
                                break;
                            case "false":
                                db.prepare('UPDATE commandOptions SET use = ? WHERE id = ?').run(0, message.guild.id.toString());
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
                                mbot.event.emit('nsfwUpdate', true, message.guild.id);
                                db.prepare('UPDATE nsfw SET use = ? WHERE id = ?').run(1, message.guild.id);
                                tools.addCooldown(this.name, 10, message);
                                message.channel.send(`${message.author} Enabled use of nsfw modules!`);
                                break;
                            case "false":
                                mbot.event.emit('nsfwUpdate', false, message.guild.id);
                                db.prepare('UPDATE nsfw SET use = ? WHERE id = ?').run(0, message.guild.id);
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