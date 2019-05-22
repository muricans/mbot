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
    execute(message, args) {
        if (!args.length) {
            return message.reply('Please add params! !modules <moduleName> [moduleOption] [setTo]');
        }

        //0=moduleName
        //1=moduleOption
        //2=setTo
        switch (args[0]) {
            case "new_user_join_message":
                if (args[1] === "message") {
                    tools.getStartMessage(message.guild.id.toString(), (use, msg) => {
                        return message.channel.send(`${message.author} ${msg}`);
                    });
                } else if (args[1] === "edit") {
                    const msg = args.slice(2, args.length).join(' ');
                    db.run('UPDATE welcomeMessage SET message = ? WHERE id = ?', msg, message.guild.id.toString());
                    return message.channel.send(`${message.author} Set welcome message to ${msg}!`);
                } else if (args[1] === "use") {
                    switch (args[2]) {
                        case "true":
                            db.run('UPDATE welcomeMessage SET use = ? WHERE id = ?', 1, message.guild.id.toString());
                            message.channel.send(`${message.author} Enabled use of sending welcome messages on join!`);
                            break;
                        default:
                            message.reply(`Please add params! !modules new_user_join_message use <true|false>`);
                            break;
                    }
                }
                break;
        }

    },
};