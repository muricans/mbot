module.exports = {
    name: 'purge',
    usage: 'No usage data found.',
    description: 'Purge all servers mbot is connected to except the server this command is being executed from.',
    owner: true,
    execute(message, args, client) {
        for (const i in client.guilds.cache.array()) {
            const guild = client.guilds.cache.array()[i];
            if (guild == message.guild) continue;
            guild.leave();
        }
        message.channel.send(`Successfully purged all other servers.`);
    },
};