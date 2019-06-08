const Discord = require('discord.js');
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./mbot.db', (err) => {
    if (err) console.log(err.message);
});

module.exports = {
    name: 'leaderboard',
    description: 'Get up to 20 users with the most points',
    async execute(message, args, client) {
        const leaders = await leaderboard(message, client);
        return message.channel.send(leaders);
    },
};

function leaderboard(message, client) {
    return new Promise((resolve) => {
        db.all('SELECT points points, id id FROM users ORDER BY points DESC', async (err, rows) => {
            if (err) return console.log(err);
            const embed = new Discord.RichEmbed().setTitle('Points Leaderboard');
            if (!rows.length) return message.channel.send('No users found!');
            const each = new Promise(async (resolve) => {
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
                for (let i = 0; i < 20; i++) {
                    if (users[i]) {
                        const user = await client.fetchUser(users[i].id);
                        embed.addField(`${i + 1}. ${user.username}`, users[i].points, true);
                    }
                }
            });
            return resolve(embed);
        });
    });
}