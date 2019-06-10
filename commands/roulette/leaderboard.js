const Discord = require('discord.js');
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./mbot.db', (err) => {
    if (err) console.log(err.message);
});

module.exports = {
    name: 'leaderboard',
    description: 'Get up to 50 users with the most points',
    async execute(message, args, client) {
        const leaders = await leaderboard(message, client);
        let page = 0;
        message.channel.send(leaders[page]).then(async sent => {
            await sent.react('◀');
            await sent.react('▶');
            sent.awaitReactions((reaction, user) => {
                if (user.id === client.user.id) return;
                reaction.remove(user);
                switch (reaction.emoji.name) {
                    case "◀":
                        if (page === 0) return;
                        page--;
                        break;
                    case "▶":
                        if (page === leaders.length - 1) return;
                        page++;
                        break;
                }
                sent.edit(leaders[page]);
            }, {
                time: (2 * 60000),
            });
        });
    },
};

function leaderboard(message, client) {
    return new Promise((resolve) => {
        db.all('SELECT points points, id id FROM users ORDER BY points DESC', async (err, rows) => {
            if (err) return console.log(err);
            const embeds = [];
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
                let method = Math.floor(users.length / 10) - 1;
                for (let i = -1; i < method; i++) {
                    embeds.push(new Discord.RichEmbed());
                    method = Math.floor(users.length / 10);
                }
                let multiplier = 1;
                for (let i = 0; i < 10 * multiplier; i++) {
                    if (i === 50) {
                        break;
                    }
                    if (users[i]) {
                        const user = await client.fetchUser(users[i].id);
                        embeds[multiplier - 1].addField(`${i + 1}. ${user.username}`, users[i].points, true);
                        if (i === (10 * multiplier) - 1) {
                            multiplier++;
                        }
                    }
                }
            });
            return resolve(embeds);
        });
    });
}