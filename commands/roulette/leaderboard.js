const Discord = require('discord.js');
const sqlite = require('sqlite3').verbose();
const EmbedBuilder = require('../../embedbuilder');

const db = new sqlite.Database('./mbot.db', (err) => {
    if (err) console.log(err.message);
});

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
    return new Promise((resolve) => {
        db.all('SELECT points points, id id FROM users ORDER BY points DESC LIMIT 0,50', async (err, rows) => {
            if (err) return console.log(err);
            const embeds = new EmbedBuilder();
            if (!rows.length) return channel.send('No users found!');
            const each = new Promise((resolve) => {
                const users = [];
                rows.forEach((val, i, arr) => {
                    users.push({
                        id: arr[i].id,
                        points: arr[i].points,
                    });
                });
                return resolve(users);
            });
            await each.then(async users => {
                let method = Math.floor(users.length / 10) - 1;
                for (let i = -1; i < method; i++) {
                    embeds.addEmbed(new Discord.RichEmbed());
                    method = Math.floor(users.length / 10);
                }
                let multiplier = 1;
                for (let i = 0; i < 10 * multiplier; i++) {
                    if (i === 50) {
                        break;
                    }
                    if (users[i]) {
                        const user = await client.fetchUser(users[i].id);
                        embeds.getEmbeds()[multiplier - 1].addField(`${i + 1}. ${user.username}`, users[i].points, true);
                        if (i === (10 * multiplier) - 1) {
                            multiplier++;
                        }
                    }
                }
                embeds
                    .setTitle('Points Leaderboard')
                    .setTime(2 * 60000)
                    .setChannel(channel);
            });
            return resolve(embeds);
        });
    });
}