const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const settings = require('./settings.json');
const sqlite = require('sqlite3').verbose();
const EventEmitter = require('events');
const mbot = require('./mbot');
const fs = require('fs');
const Logger = require('./logger');

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

const nsfw = "Please move to an nsfw channel :flushed:";
const bannedLinks = ['pornhub.com', 'xvideos.com', 'erome.com', 'xnxx.com', 'xhamster.com', 'redtube.com', 'xmov.fun', 'porness.net',
  'youtube.com', 'youtu.be', 'nhentai.net', 'efukt.com', 'hdpornhere.com', 'fm4.ru', 'xvieoxx.com', 'xtube.com'
];
// allowed embed endings
const endings = ['.png', '.jpg', '.gif'];
const emojis = ['🍆', '💦', '😳', '🍌', '😏', '🍑', '😊'];
/**
 * A list of all admin commands for the bot.
 */
module.exports.adminCommands = ['set', 'give', 'delete', 'echo', 'clean', 'prefix', 'suggestions'];
/**
 * Functions for the bot.
 * @example
 * const tls = require('./tools');
 * const tools = new tls.Tools();
 */
class Tools {
  /**
   * Checks if the string provided contains one of the endings in the ending list.
   * @param {string} string
   * @returns {boolean} Whether the string contains an item from the endings list.
   */
  end(string) {
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

  /**
   * Checks if the string provided contains one of the banned links in the bannedLinks list.
   * @param {string} string
   * @returns {boolean} Whether the string contains an item from the bannedLinks list.
   */
  banned(string) {
    let contains = false;
    var b, banned;
    for (b in bannedLinks) {
      banned = bannedLinks[b];
      if (string.includes(banned)) {
        contains = true;
        if (settings.debug) {
          Logger.debug('Banned link found!');
        }
      }
    }
    return contains;
  }

  /**
   * Sets a users points
   * @param {number} amnt The amount of points to add.
   * @param {string} id The id to give the points to.
   */
  setPoints(amnt, id) {
    db.run('UPDATE users SET points = ? WHERE id = ?', amnt, id);
    mbot.event.emit('pointsUpdated', amnt, id);
  }

  getNLMessage(name, id, callback) {
    db.get(`SELECT use use, message message, channel channel FROM ${name} WHERE id = ${id}`, (err, row) => {
      if (err) {
        return console.log(err);
      }
      callback(row.use, row.message, row.channel);
    });
  }

  getPrefix(id, callback) {
    db.get(`SELECT prefix prefix FROM prefix WHERE id = ${id}`, (err, row) => {
      if (err) return console.log(err);
      callback(row.prefix);
    });
  }

  /**
   * Roulette a users points.
   * @param {number} amnt The amount of points the user will be rouletting.
   * @param {number} current The users current point balance.
   * @param {Discord.Message} message The message to respond to.
   * @param {Discord.Client} client The discord bots client.
   * @param {boolean} all Is the user rouletting all their points?
   */
  roulette(amnt, current, message, client, all) {
    const smile = client.emojis.get("566861749324873738");
    const wtf = client.emojis.get("567905581868777492");
    const chance = Math.floor(Math.random() * 100);
    let wonall;
    let won;
    let lost;
    if (chance > 56) { // chance of winning
      if (all) {
        wonall = current * 2;
      } else {
        won = current + amnt;
      }
      //const win = won
      if (all) {
        this.setPoints(wonall, message.author.id.toString());
        return message.reply(smile + " You won " + (wonall - current) + " points! Now you have " + wonall + " points.");
      } else {
        this.setPoints(won, message.author.id.toString());
        return message.reply(smile + " You won " + (won - current) + " points! Now you have " + won + " points.");
      }
    } else {
      if (all) {
        lost = current - current;
      } else {
        lost = current - amnt;
      }
      this.setPoints(lost, message.author.id.toString());
      return message.reply(wtf + " You lost " + amnt + " points! Now you have " + lost + " points.");
    }
  }

  /**
   * @deprecated Isn't very reliable.
   * 
   * @description Web search a url, specifically better for images.
   * @param {string} url The url to search. 
   * @param {Discord.Message} message The message to respond to.
   */
  webSearch(url, message) {
    if (url.includes('.gifv')) {
      message.channel.send("Random Web Search")
      message.channel.send(url);
      message.channel.send("Requested by: " + message.author.username);
    } else if (this.end(url)) {
      const embed = new Discord.RichEmbed()
        .setTitle("Random Web Search")
        .setImage(url)
        .setFooter("Requested by: " + message.author.username);
      message.channel.send(embed);
    } else {
      message.channel.send("Random Web Search");
      message.channel.send(url);
      message.channel.send("Requested by: " + message.author.username);
    }
  }

  /**
   * @deprecated Most of the imgur links it sends are dead links, it's very unreliable.
   * 
   * @description Get a random imgur image
   * @param {Discord.Message} message The message to respond to.
   */
  async getImage(message) {
    try {
      const {
        body
      } = await snekfetch
        .get('https://imgur.com/gallery/random.json')
        .query({
          limit: 4000
        });
      const rn = Math.floor(Math.random() * body.data.length);
      const imageData = body.data[rn].hash;
      message.channel.send('https://i.imgur.com/' + imageData);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Search rule34.xxx for images
   * @param {Discord.Message} message The message to respond to.
   * @param {boolean} hasTags Whether or not the search contains tags.
   * @param {string} tags The tags to apply to the search.
   * @example
   * tools.rule34(message, true, 'my_tag+my_other_tag');
   */
  async rule34(message, hasTags, tags) {
    let link, footer;
    if (hasTags) {
      link = "https://r34-json-api.herokuapp.com/posts?query=100&tags=" + tags;
      footer = 'Requested by: ' + message.author.username + ' With tags: ' + tags;
    } else {
      link = "https://r34-json-api.herokuapp.com/posts?query=100";
      footer = 'Requested by: ' + message.author.username;
    }
    try {
      const {
        body
      } = await snekfetch
        .get(link);
      const rn = Math.floor(Math.random() * body.length);
      const imageData = body[rn].file_url;
      const embed = new Discord.RichEmbed()
        .setTitle('Random rule34.xxx image')
        .setImage(imageData)
        .setFooter(footer);
      message.channel.send(embed);
    } catch (err) {
      message.channel.send('Could not find any images with those tags!');
    }
  }

  /**
   * Search danbooru for images.
   * @param {Discord.Message} message The message to respond to.
   * @param {boolean} hasTags Whether or not the search contains tags.
   * @param {string} tags The tags to apply to the search.
   * @param {boolean} isRedo Whether or not the current search is a second one.
   * @example
   * tools.danbooru(message, true, 'my_tag+my_other_tag');
   */
  async danbooru(message, hasTags, tags, isRedo) {
    let link, footer;
    if (hasTags) {
      link = "https://danbooru.donmai.us/posts.json?tags=" + tags;
      footer = 'Requested by: ' + message.author.username + ' With tags: ' + tags;
    } else {
      link = "https://danbooru.donmai.us/posts.json";
      footer = 'Requested by: ' + message.author.username;
    }
    try {
      const {
        body
      } = await snekfetch
        .get(link);
      const rn = Math.floor(Math.random() * body.length);
      const data = body[rn];
      const imageData = data.file_url;
      const rating = data.rating;
      if (rating === "q" || rating === "e") {
        if (message.channel.nsfw) {
          if (imageData.includes('.gifv')) {
            message.channel.send("Random danbooru image")
            message.channel.send(imageData);
            message.channel.send(footer);
          } else if (this.end(imageData)) {
            const embed = new Discord.RichEmbed()
              .setTitle("Random danbooru image")
              .setImage(imageData)
              .setFooter(footer);
            message.channel.send(embed);
          } else {

            message.channel.send("Random danbooru image");
            message.channel.send(imageData);
            message.channel.send(footer);
          }
        } else if (!message.channel.nsfw) {
          if (isRedo) {
            return message.channel.send(nsfw);
          } else {
            return this.danbooru(message, hasTags, tags, true);
          }
        }
      } else if (rating === "s") {
        if (imageData.includes('.gifv')) {
          message.channel.send("Random danbooru image")
          message.channel.send(imageData);
          message.channel.send(footer);
        } else if (this.end(imageData)) {
          const embed = new Discord.RichEmbed()
            .setTitle("Random danbooru image")
            .setImage(imageData)
            .setFooter(footer);
          message.channel.send(embed);
        } else {

          message.channel.send("Random danbooru image");
          message.channel.send(imageData);
          message.channel.send(footer);
        }
      }
    } catch (err) {
      message.channel.send("Could not find any images with those tags!");
    }
  }

  /**
   * @deprecated rSearch is a better function which correctly utilizes the time.
   * @see #rSearch
   * 
   * @description Get a random post from a subreddit
   * @param {string} sub The subreddit to search.
   * @param {string} time The timeframe to find posts. (All, Year, Month, Week, Day)
   * @param {Discord.Message} message The message to respond to.
   * @param {boolean} filterBanned Whether or not you want to filter through the banned links.
   * @example
   * tools.search('aww', 'all', message, true);
   */
  async search(sub, time, message, filterBanned) {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    try {
      const {
        body
      } = await snekfetch
        .get('https://www.reddit.com/r/' + sub + '.json?sort=top&t=' + time)
        .query({
          limit: 4000
        });
      const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
      if (!allowed.length) return message.channel.send(nsfw);
      const rn = Math.floor(Math.random() * allowed.length);
      const postData = allowed[rn].data;
      const image = postData.url;
      const title = postData.title;
      const up = postData.ups;
      const subreddit = postData.subreddit_name_prefixed;
      if (this.banned(image) && filterBanned) {
        return this.search(sub, time, message, filterBanned);
      }
      if (image.includes('.gifv')) {
        message.channel.send(title)
        message.channel.send(image);
        message.channel.send("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
      } else if (this.end(image)) {
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

  /**
   * Get a random post from a subreddit
   * @param {string} sub The subreddit to search.
   * @param {string} time The timeframe to find posts. (All, Year, Month, Week, Day)
   * @param {Discord.Message} message The message to respond to.
   * @param {boolean} filterBanned Whether or not you want to filter through the banned links.
   * @example
   * tools.rSearch('aww', 'all', message, true);
   */
  async rSearch(sub, time, message, filterBanned) {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    try {
      const {
        body
      } = await snekfetch
        .get('https://www.reddit.com/r/' + sub + '/top.json?sort=top&t=' + time)
        .query({
          limit: 4000
        });
      const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
      if (!allowed.length) return message.channel.send(nsfw);
      const rn = Math.floor(Math.random() * allowed.length);
      const postData = allowed[rn].data;
      const image = postData.url;
      const title = postData.title;
      const up = postData.ups;
      const subreddit = postData.subreddit_name_prefixed;
      if (this.banned(image) && filterBanned) {
        return this.rSearch(sub, time, message, filterBanned);
      }
      if (image.includes('.gifv')) {
        message.channel.send(title)
        message.channel.send(image);
        message.channel.send("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
      } else if (this.end(image)) {
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

  /**
   * Search a subreddit for a post.
   * @param {string} sub The subreddit to search.
   * @param {string} searchTerm What to search the subreddit for.
   * @param {string} time The timeframe to find posts. (All, Year, Month, Week, Day)
   * @param {Discord.Message} message The message to respond to.
   * @param {boolean} filterBanned Whether or not you want to filter banned links from the search.
   * @example
   * tools.find('aww', 'cute dogs', 'day', message, true);
   */
  async find(sub, searchTerm, time, message, filterBanned) {
    var randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    try {
      const {
        body
      } = await snekfetch
        .get('https://www.reddit.com/r/' + sub + '/search.json?q=' + searchTerm +
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
      if (!allowed.length) return message.channel.send(nsfw);
      const postData = allowed[rn].data;
      const image = postData.url;
      const title = postData.title;
      const up = postData.ups;
      const subreddit = postData.subreddit_name_prefixed;
      if (this.banned(image) && filterBanned) {
        return this.find(sub, searchTerm, time, message, filterBanned);
      }
      if (image.includes('.gifv')) {
        message.channel.send(title)
        message.channel.send(image);
        message.channel.send("Subreddit: " + subreddit + " " + randomEmoji + " Requested by: " + message.author.username + " 🔼 " + up);
      } else if (this.end(image)) {
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

  parseCommandModule(message, jsonMsg) {
    let mention = message.mentions.users.first();
    const date = new Date();
    let options = {
      hour: '2-digit',
      minute: '2-digit'
    };
    if (!mention) {
      mention = message.author;
    }
    const formattedMsg = jsonMsg
      .replace('{mention}', mention)
      .replace('{id}', mention.id.toString())
      .replace('{time}', date.toLocaleString('en-us', options));
    return message.channel.send(formattedMsg.slice(9));
  }

  users(client) {
    return client.users.array();
  }
}
module.exports.Tools = Tools;

/**
 * @callback callback
 * @returns {void}
 */

/**
 * @callback data
 * @param {*} data The data from the file being read.
 * @returns {void}
 */

/**
 * Makes files.
 * @example
 * const tls = require('./tools');
 * const file = new tls.File('myFile', './', 'json');
 */
class File {
  /**
   * The files data.
   * 
   * @param {string} name The name of the file you want to make.
   * @param {string} location The location of which the file will be made in.
   * @param {string} type The type of file you want to make. (Currently only supports JSON)
   */
  constructor(name, location, type) {
    this.name = name;
    this.location = location;
    switch (type) {
      case "json":
        this.type = ".json";
        break;
      default:
        let err = new InvalidFileError(`${name} has an unsupported file extension! please use json.`);
        this.exist = false;
        return Logger.error(err.stack);
    }
    this.file = `${this.location}${this.name}${this.type}`;
    this.make(JSON.stringify([]));
  }

  exists() {
    if (!this.exist) {
      if (settings.debug) {
        return Logger.debug(`File: ${this.file} does not exist!`);
      }
      return;
    }
  }

  make(content) {
    fs.exists(this.file, (exists) => {
      this.exist = exists;
      if (exists)
        if (settings.debug) return Logger.debug(`File: ${this.file} already exists!`);
        else return;
      else fs.writeFile(this.file, content, (err) => {
        if (err) return console.log(err);
        Logger.file(`Made ${this.file} successfully!`);
      });
    });
  }

  /**
   * Add content to your file.
   * 
   * @param {*} content The content you will push to the file.
   * @param {callback} [callback] Have a callback when the data is finished being added.
   * @example
   * file.add({"someString": "someResponse"}, () => {
   *  //stuff here
   * });
   */
  add(content, callback) {
    this.exists();
    fs.readFile(this.file, 'utf8', (err, data) => {
      if (err) return console.log(err);
      // assume array
      const parsed = JSON.parse(data);
      parsed.push(content);
      fs.writeFile(this.file, JSON.stringify(parsed), (err) => {
        if (err) return console.log(err);
        if (callback != null) callback();
      });
    });
  }

  /**
   * Read the contents of your file.
   * 
   * @param {data} [callback] Have a callback when the data is finished being read.
   * @example
   * file.read((data) => {
   * console.log(data);
   * });
   */
  read(callback) {
    this.exists();
    if (callback != null) return fs.readFile(this.file, 'utf8', (err, d) => {
      if (err) return console.log(err);
      const data = JSON.parse(d);
      callback(data);
    });
    return JSON.parse(fs.readFileSync(this.file, 'utf8'));
  }

  /**
   * Override all data currently in the file and write the content provided in its place.
   * 
   * @param {*} content The content you want to write to your file.
   * @param {callback} [callback] Have a callback when the data is finished being written.
   * 
   * @example
   * file.write(["some": {"thing": ['here']}], () => {
   * // stuff here
   * });
   */
  write(content, callback) {
    this.exists();
    fs.writeFile(this.file, JSON.stringify(content), (err) => {
      if (err) return console.log(err);
      if (callback != null) callback();
    });
  }
}
module.exports.File = File;

class InvalidFileError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, InvalidFileError);
  }
}

/**
 * An event emitter.
 */
class Event extends EventEmitter {}

module.exports.Event = Event;