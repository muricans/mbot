module.exports = {
    name: 'kick',
    usage: '<player> [reason]',
    description: 'Kicks specified user',
    args: true,
    minArgs: 1,
    execute(message, args) {
        const canKick = message.channel.permissionsFor(message.member).has('KICK_MEMBERS');
        if (!canKick) {
            return message.channel.send(`${message.author} You don't have permission to use this command!`);
        }
        const mention = message.mentions.users.first();
        if (!mention) {
            return message.channel.send(`${message.author} Could not find that user!`);
        }
        const hasAdmin = message.channel.permissionsFor(message.guild.member(mention)).has('ADMINISTRATOR');
        const admin = message.channel.permissionsFor(message.member).has('ADMINISTRATOR');
        if (hasAdmin && !admin) {
            return message.channel.send(`${message.author} You don't have permission to kick that user!`);
        }
        const mRole = message.guild.member(mention).highestRole;
        const role = message.member.highestRole;
        if (mRole.comparePositionTo(role) > 0 || mRole.position === role.position) {
            return message.channel.send(`${message.author} That user has a higher role than you!`);
        }
        if (!message.guild.member(mention).kickable) {
            return message.channel.send(`${message.author} This member can't be kicked!`);
        }
        if (!args[1]) {
            return message.guild.member(mention).kick(`Kicked by: ${message.author.username}`).then((member) => {
                message.channel.send(`${message.author} Kicked user ${member.user}!`);
            }).catch((reason) => {
                if (reason) return console.log(reason);
            });
        } else {
            const kickReason = args.slice(1, args.length).join(' ');
            return message.guild.member(mention).kick(`Kicked by: ${message.author.username} Reason: ${kickReason}`).then((member) => {
                message.channel.send(`${message.author} Kicked user ${member.user}\nReason: ${kickReason}`);
            }).catch((reason) => {
                if (reason) return console.log(reason);
            });
        }
    },
};