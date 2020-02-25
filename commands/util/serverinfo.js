const Discord = require('discord.js');
const tls = require('../../tools');
const tools = new tls.Tools();

module.exports = {
    name: 'serverinfo',
    usage: 'No usage data found.',
    description: 'Get server info on the server you are currently on, or another the bot is currently on by giving that servers ID.',
    execute(message, args, client) {
        const using = tools.useServerInfo(message.guild.id);
        if (!using) return;
        if (!args.length) {
            const guild = message.guild;
            let icon = guild.iconURL();
            if (icon === null) {
                icon = "No icon data found.";
            }
            const embed = new Discord.MessageEmbed()
                .setAuthor(guild.name)
                .setDescription('Server information is now being displayed.')
                .addFields([{
                    name: 'Owner',
                    value: `${guild.owner.user.username}#${guild.owner.user.discriminator}`,
                }])
                .addFields([{
                    name: 'Server ID',
                    value: guild.id,
                }])
                .addFields([{
                    name: 'Time of Creation',
                    value: guild.createdAt,
                }])
                .addFields([{
                    name: 'Icon URL',
                    value: icon,
                }])
                .setThumbnail(guild.iconURL())
                .addFields([{
                    name: 'Members',
                    value: guild.memberCount,
                }]);
            return message.channel.send(embed);
        }
        if (!isNaN(args[0])) {
            const guild = client.guilds.cache.get(args[0]);
            if (!guild) {
                return message.channel.send(`${message.author} Could not find a server with the given ID!`);
            }
            let icon = guild.iconURL();
            if (icon === null) {
                icon = "No icon data found.";
            }
            const embed = new Discord.MessageEmbed()
                .setAuthor(guild.name)
                .setDescription('Server information is now being displayed.')
                .addFields([{
                    name: 'Owner',
                    value: `${guild.owner.user.username}#${guild.owner.user.discriminator}`,
                }])
                .addFields([{
                    name: 'Server ID',
                    value: guild.id,
                }])
                .addFields([{
                    name: 'Time of Creation',
                    value: guild.createdAt,
                }])
                .addFields([{
                    name: 'Icon URL',
                    value: icon,
                }])
                .setThumbnail(guild.iconURL())
                .addFields([{
                    name: 'Members',
                    value: guild.memberCount,
                }]);
            return message.channel.send(embed);
        } else {
            return message.channel.send(`${message.author} Could not find a server with the given ID!`);
        }
    },
};