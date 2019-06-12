const Discord = require('discord.js');
const EmbedBuilder = require('../../embedbuilder');
const {
    Tools,
} = require('../../tools');
const tools = new Tools();

module.exports = {
    name: 'leaderboard',
    description: 'Get up to 50 users with the most points',
    async execute(message, args, client) {
        const leaders = await leaderboard(message.channel, client);
        leaders.build();
    },
};

/**
 * 
 * @param {Discord.Message} message 
 * @param {Discord.Client} client 
 * @returns {Promise<EmbedBuilder>}
 */
function leaderboard(channel, client) {
    return new Promise(async (resolve) => {
        const embeds = new EmbedBuilder();
        const users = [];
        for (let i = 0; i < tools.users(client).length; i++) {
            const user = tools.users(client)[i];
            const points = await tools.getPoints(user.id);
            users.push({
                id: user.id,
                username: user.username,
                points: points,
            });
        }
        users.sort((a, b) => (a.points > b.points) ? -1 : 1);
        let pages = 0;
        let m = 1;
        for (let i = 0; i < 10 * m; i++) {
            if (i === 50)
                break;
            if (!embeds.getEmbeds()[m - 1] && users[i]) {
                embeds.addEmbed(new Discord.RichEmbed());
                pages++;
            }
            if (i === (10 * m) - 1)
                m++;
        }
        let multiplier = 1;
        for (let i = 0; i < 10 * multiplier; i++) {
            if (i === 50) {
                break;
            }
            if (users[i]) {
                embeds.getEmbeds()[multiplier - 1]
                    .addField(`${i + 1}. ${users[i].username}`, users[i].points, true)
                    .setFooter(`Page ${multiplier}/${pages}`);
                if (i === (10 * multiplier) - 1) {
                    multiplier++;
                }
            }
        }
        embeds
            .setTitle('Points Leaderboard')
            .setTime(2 * 60000)
            .setChannel(channel);
        return resolve(embeds);
    });
}