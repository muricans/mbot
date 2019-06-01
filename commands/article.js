const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('8f9cfea328634483b5510b7853223c71');
const Discord = require('discord.js');

module.exports = {
    name: 'article',
    usage: '[category]',
    description: 'Returns a random article with specified category if one is provided.',
    async execute(message, args) {
        const options = {
            country: 'us',
            language: 'en',
        };
        if (args[0] !== null) {
            options.category = args[0];
        }
        newsapi.v2.topHeadlines(options).then(body => {
            const article = body.articles[Math.floor(Math.random() * body.articles.length)];
            if (!article) {
                return message.channel.send('No articles were found!');
            }
            const embed = new Discord.RichEmbed()
                .setTitle(article.title)
                .setDescription(article.description)
                .setAuthor(article.author)
                .setURL(article.url)
                .setThumbnail(article.urlToImage)
                .setFooter('mbot uses News API to fetch articles.')
                .setTimestamp(article.publishedAt);
            return message.channel.send(embed);
        }).catch(reason => {
            console.log(reason);
        });
    },
};