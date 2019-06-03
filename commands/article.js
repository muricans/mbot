const settings = require('../settings.json');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(settings.newsAPIKey);
const Discord = require('discord.js');

module.exports = {
    name: 'article',
    usage: '[category]',
    description: 'Returns a random article with specified category if one is provided.',
    async execute(message, args) {
        const options = {
            language: 'en',
        };
        if (args[0]) {
            if (args[0].startsWith('c:')) {
                const category = args[0].slice(2);
                if (!category) {
                    return message.channel.send('Please define a category');
                }
                options.category = category;
            } else if (args[0].startsWith('q:')) {
                const query = args[0].slice(2).replace('_', ' ');
                if (!query) {
                    return message.channel.send('Please define a query');
                }
                options.q = query;
            } else {
                return message.channel.send(`${message.author} Allowed params: 'q:', 'c:'`);
            }
        }
        if (args[1]) {
            if (args[1].startsWith('c:')) {
                const category = args[1].slice(2);
                if (!category) {
                    return message.channel.send('Please define a category');
                }
                options.category = category;
            } else if (args[1].startsWith('q:')) {
                const query = args[1].slice(2).replace('_', ' ');
                if (!query) {
                    return message.channel.send('Please define a query');
                }
                options.q = query;
            } else {
                return message.channel.send(`${message.author} Allowed params: 'q:', 'c:'`);
            }
        }
        if (args[0] && !options.category) {
            newsapi.v2.everything(options).then(body => {
                handleArticle(message, body);
            }).catch(reason => {
                console.log(reason);
            });
        } else {
            options.country = 'us';
            newsapi.v2.topHeadlines(options).then(body => {
                handleArticle(message, body);
            }).catch(reason => {
                console.log(reason);
            });
        }
    },
};

function handleArticle(message, body) {
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
}