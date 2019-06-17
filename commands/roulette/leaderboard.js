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
        const pUsers = await tools.pointsUsers();
        for (let i = 0; i < pUsers.length; i++) {
            const user = tools.users(client).find(usr => usr.id === pUsers[i].id);
            const exists = await tools.pointsExist(user.id);
            if (user.bot || !exists) continue;
            users.push({
                id: user.id,
                username: user.username,
                points: pUsers[i].points,
            });
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