const Discord = require('discord.js');
const {
    Tools,
} = require('../../tools');
const tools = new Tools();

module.exports = {
    used: new Discord.Collection(),
    name: 'cashout',
    description: 'Can be run once every 10 minutes to get 1-100 points',
    async execute(message) {
        if (!this.used.has(message.author.id)) {
            this.used.set(message.author.id, true);
            const randomPoints = Math.floor(Math.random() * 100) + 1;
            const current = await tools.getPoints(message.author.id);
            tools.setPoints(current + randomPoints, message.author.id);
            setTimeout(() => this.used.delete(message.author.id), 10000);
            return message.channel.send(`${message.author} You won ${randomPoints} points!\nYou can run this command again in 10 minutes.`);
        } else
            return message.channel.send(`${message.author} You have already used this command in the past 10 minutes!`);
    },
};