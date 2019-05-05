const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const settings = require('./settings.json');
const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

const errMsg = "Please move to an nsfw channel :flushed:";
const bannedLinks = ['pornhub.com', 'xvideos.com', 'erome.com', 'xnxx.com', 'xhamster.com', 'redtube.com', 'xmov.fun', 'porness.net',
  'youtube.com', 'youtu.be', 'nhentai.net', 'efukt.com'
];
// allowed embed endings
const endings = ['.png', '.jpg', '.gif'];
const emojis = ['🍆', '💦', '😳', '🍌', '😏', '🍑', '😊'];

module.exports.setPoints = function (amnt, id) {
  db.run('UPDATE users SET points = ? WHERE id = ?', amnt, id);
}

module.exports.roulette = function (amnt, current, message, client, all) {
  const smile = client.emojis.get("566861749324873738");
  const wtf = client.emojis.get("567905581868777492");
  const chance = Math.floor(Math.random() * 100);
  var wonall;
  var won;
  var lost;
  if (chance > 56) { // chance of winning
    if (all) {
      wonall = current * 2;
    } else {
      won = current + amnt;
    }
    //const win = won
    if (all) {
      module.exports.setPoints(wonall, message.author.id.toString());
      return message.reply(smile + " You won " + (wonall - current) + " points! Now you have " + wonall + " points.");
    } else {
      module.exports.setPoints(won, message.author.id.toString());
      return message.reply(smile + " You won " + (won - current) + " points! Now you have " + won + " points.");
    }
  } else {
    if (all) {
      lost = current - current;
    } else {
      lost = current - amnt;
    }
    module.exports.setPoints(lost, message.author.id.toString());
    return message.reply(wtf + " You lost " + amnt + " points! Now you have " + lost + " points.");
  }
}

// check for ending of links exentsion
module.exports.end = function (string) {
  let contains = false;
  var e, ending;
  for (e in endings) {
    ending = endings[e];
    if (string.includes(ending)) {
      contains = true;
    }
  }
  return contains;
}

// check for banned links
module.exports.banned = function (string) {
  let contains = false;
  var l, link;
  for (l in bannedLinks) {
    link = bannedLinks[l];
    if (string.includes(link)) {
      if (settings.debug) {
        console.log('Found a banned link');
      }
      contains = true;
    }
  }
  return contains;
}

module.exports.webSearch = function (url, message) {
  if (url.includes('.gifv')) {
    message.channel.send("Random Twitch Image")
    message.channel.send(url);
    message.channel.send("Requested by: " + message.author.username);
  } else if (module.exports.end(url)) {
    const embed = new Discord.RichEmbed()
      .setTitle("Random Twitch Image")
      .setImage(url)
      .setFooter("Requested by: " + message.author.username);
    message.channel.send(embed);
  } else {
    message.channel.send("Random Twitch Image");
    message.channel.send(url);
    message.channel.send("Requested by: " + message.author.username);
  }
}

module.exports.getImage = function (apiURL, apiKey, message) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      JSON.parse(req.responseText);
    } else {
      console.log("error");
    }
  }
  req.open("GET", apiURL, true);
  req.setRequestHeader('Authorization', 'Client-ID ' + apiKey);
  req.send(null);
  const embed = new Discord.RichEmbed()
    .setTitle("Random Twitch Image")
    .setImage(req.response)
    .setFooter("Requested by: " + message.author.username);
  message.channel.send(embed);
  message.channel.send(req);
}

// find a random post from reddit
module.exports.search = async function (list, time, message) {
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
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
    const postData = allowed[rn].data;
    const image = postData.url;
    const title = postData.title;
    const up = postData.ups;
    const subreddit = postData.subreddit_name_prefixed;
    if (module.exports.banned(image)) {
      return module.exports.search(list, time, message);
    }
    if (image.includes('.gifv')) {
      message.channel.send(title)
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
    } else if (module.exports.end(image)) {
      const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setImage(image)
        .setFooter("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
      message.channel.send(embed);
    } else {

      message.channel.send(title);
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
    }
  } catch (err) {
    console.log(err);
  }

}

module.exports.rSearch = async function (list, time, message) {
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
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
    const postData = allowed[rn].data;
    const image = postData.url;
    const title = postData.title;
    const up = postData.ups;
    const subreddit = postData.subreddit_name_prefixed;
    if (module.exports.banned(image)) {
      return module.exports.search(list, time, message);
    }
    if (image.includes('.gifv')) {
      message.channel.send(title)
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
    } else if (module.exports.end(image)) {
      const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setImage(image)
        .setFooter("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
      message.channel.send(embed);
    } else {

      message.channel.send(title);
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
    }
  } catch (err) {
    console.log(err);
  }

}

module.exports.find = async function (list, searchTerm, time, message) {
  var randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  try {
    const {
      body
    } = await snekfetch
      .get('https://www.reddit.com/r/' + list + '/search.json?q=' + searchTerm +
        '&restrict_sr=on&include_over_18=on&sort=relevance&t=' + time)
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
    const postData = allowed[rn].data;
    const image = postData.url;
    const title = postData.title;
    const up = postData.ups;
    const subreddit = postData.subreddit_name_prefixed;
    if (module.exports.banned(image)) {
      return module.exports.find(list, searchTerm, time, message);
    }
    if (image.includes('.gifv')) {
      message.channel.send(title)
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
    } else if (module.exports.end(image)) {
      const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setImage(image)
        .setFooter("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
      message.channel.send(embed);
    } else {
      message.channel.send(title);
      message.channel.send(image);
      message.channel.send("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
    }
  } catch (err) {
    console.log(err);
  }
}