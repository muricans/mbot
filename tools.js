const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const mbot = require('./mbot.js');

const errMsg = "Please move to an nsfw channel :flushed:";
var bannedLinks = ['pornhub.com', 'xvideos.com', 'erome.com', 'xnxx.com', 'xhamster.com', 'redtube.com', 'xmov.fun', 'porness.net'];
var endings = ['.png', '.jpg', '.gif'];

// check for ending of links exentsion
module.exports.end = function(string) {
  var contains = false;
  for (var i = 0; i < endings.length; i++) {
    var ending = endings[i];
    if (string.includes(ending)) {
      contains = true;
    }
  }
  return contains;
}

// check for banned links
module.exports.banned = function(string) {
  var contains = false;
  for (var i = 0; i < bannedLinks.length; i++) {
    var link = bannedLinks[i];
    if (string.includes(link)) {
      if (mbot.debug) {
        console.log('Found a banned link');
      }
      contains = true;
    }
  }
  return contains;
}

// find a random post from reddit
module.exports.search = async function(list, time, message) {
  try {
    const {
      body
    } = await snekfetch
      .get('https://www.reddit.com/r/' + list + '.json?sort=top&t=' + time)
      .query({
        limit: 4000
      });
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    if (!allowed.length) return message.channel.send(errMsg);
    const rn = Math.floor(Math.random() * allowed.length);
    var postData = allowed[rn].data;
    var image = postData.url;
    var title = postData.title;
    var up = postData.ups;
    var subreddit = postData.subreddit_name_prefixed;
    if (module.exports.banned(image)) {
      return module.exports.search(list, time, message);
    }
    if (image.includes('.gifv')) {
      message.channel.send(title)
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " Requested by: " + message.author.username + " 🔼 " + up);
    } else if (module.exports.end(image)) {
      const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setImage(image)
        .setFooter("Subreddit: " + subreddit + " Requested by: " + message.author.username + " 🔼 " + up);
      message.channel.send(embed);
    } else {

      message.channel.send(title);
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " Requested by: " + message.author.username + " 🔼 " + up);
    }
  } catch (err) {
    console.log(err);
  }

}

module.exports.rSearch = async function(list, time, message) {
  try {
    const {
      body
    } = await snekfetch
      .get('https://www.reddit.com/r/' + list + '/top.json?sort=top&t=' + time)
      .query({
        limit: 4000
      });
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    if (!allowed.length) return message.channel.send(errMsg);
    const rn = Math.floor(Math.random() * allowed.length);
    var postData = allowed[rn].data;
    var image = postData.url;
    var title = postData.title;
    var up = postData.ups;
    var subreddit = postData.subreddit_name_prefixed;
    if (module.exports.banned(image)) {
      return module.exports.search(list, time, message);
    }
    if (image.includes('.gifv')) {
      message.channel.send(title)
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " Requested by: " + message.author.username + " 🔼 " + up);
    } else if (module.exports.end(image)) {
      const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setImage(image)
        .setFooter("Subreddit: " + subreddit + " Requested by: " + message.author.username + " 🔼 " + up);
      message.channel.send(embed);
    } else {

      message.channel.send(title);
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " Requested by: " + message.author.username + " 🔼 " + up);
    }
  } catch (err) {
    console.log(err);
  }

}

module.exports.find = async function(list, searchTerm, time, message) {
  try {
    const {
      body
    } = await snekfetch
      .get('https://www.reddit.com/r/' + list + '/search.json?q=' + searchTerm + '&restrict_sr=on&include_over_18=on&sort=relevance&t=' + time)
      .query({
        limit: 4000
      });
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    const found = body.data.dist;
    const rn = Math.floor(Math.random() * allowed.length);
    if (found < 1) {
      return message.channel.send('No results found!');
    }
    if (!allowed.length) return message.channel.send(errMsg);
    var postData = allowed[rn].data;
    var image = postData.url;
    var title = postData.title;
    var up = postData.ups;
    var subreddit = postData.subreddit_name_prefixed;
    if (module.exports.banned(image)) {
      return module.exports.find(list, searchTerm, time, message);
    }
    if (image.includes('.gifv')) {
      message.channel.send(title)
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " Requested by: " + message.author.username + " 🔼 " + up);
    } else if (module.exports.end(image)) {
      const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setImage(image)
        .setFooter("Subreddit: " + subreddit + " Requested by: " + message.author.username + " 🔼 " + up);
      message.channel.send(embed);
    } else {
      message.channel.send(title);
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " Requested by: " + message.author.username + " 🔼 " + up);
    }
  } catch (err) {
    console.log(err);
  }
}