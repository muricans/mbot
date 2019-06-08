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
        db.all('SELECT points points, id id FROM users ORDER BY points DESC', (err, rows) => {
            if (err) return console.log(err);
            const embed = new Discord.RichEmbed().setTitle('Points Leaderboard');
            if (!rows.length) return message.channel.send('No users found!');
            rows.map(async (val, i, arr) => {
                if (i < 20) {
                    const user = await client.fetchUser(arr[i].id);
                    embed.addField(`${i + 1}. ${user.username}`, arr[i].points, true);
                }
            });
            resolve(embed);
        });
    });
}