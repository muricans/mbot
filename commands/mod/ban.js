const {
    Tools,
} = require('../../tools');
const tools = new Tools();

module.exports = {
    name: 'ban',
    usage: '<user> [reason]',
    description: 'Bans specified user',
    args: true,
    minArgs: 1,
    cooldown: 5,
    mod: true,
    permissions: ['BAN_MEMBERS'],
    execute(message, args, client) {
        const mention = tools.parseMention(args[0], client);
        if (!mention) {
            return message.channel.send(`${message.author} Could not find that user!`);
        }
        const mRole = message.guild.member(mention).roles.highest;
        const role = message.member.roles.highest;
        if (mRole.comparePositionTo(role) > 0 || mRole.position === role.position) {
            return message.channel.send(`${message.author} That user has a higher role than you!`);
        }
        if (args.length === 1) {
            return message.member.ban(mention, {
                days: 0,
                reason: `Banned by ${message.author.username}`,
            }).then((member) => {
                return message.channel.send(`${message.author} Banned user ${member.user}`);
            }).catch((err) => {
                if (err) return console.log(err);
            });
        } else if (args.length > 1) {
            const reason = args.slice(1, args.length).join(' ');
            return message.member.ban(mention, {
                days: 0,
                reason: `Banned by ${message.author.username} Reason: ${reason}`,
            }).then((member) => {
                return message.channel.send(`${message.author} Banned user ${member.user}\nReason: ${reason}`);
            }).catch((err) => {
                if (err) return console.log(err);
            });
        }
    },
};