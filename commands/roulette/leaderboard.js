const EmbedBuilder = require('discord-embedbuilder');
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

function leaderboard(channel, client) {
    return new Promise(async (resolve) => {
        const embeds = new EmbedBuilder(channel);
        let users = [];
        for (let i = 0; i < tools.users(client).length; i++) {
            const user = tools.users(client)[i];
            if (user.bot) continue;
            tools.getPoints(user.id).then(points => {
                users.push({
                    id: user.id,
                    username: user.username,
                    points: points,
                });
            }).catch();
        }
        users = users.sort((a, b) => (a.points > b.points) ? -1 : 1).slice(0, 50);
        embeds.calculatePages(users.length, 10, (embed, i) => {
            embed.addField(`${i + 1}. ${users[i].username}`, users[i].points, true);
        });
        embeds
            .setTitle('Points Leaderboard')
            .setTime(2 * 60000);
        return resolve(embeds);
    });
}