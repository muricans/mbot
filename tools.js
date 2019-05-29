const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const settings = require('./settings.json');
const sqlite = require('sqlite3').verbose();
const EventEmitter = require('events');
const mbot = require('./mbot');
const fs = require('fs');
const Logger = require('./logger');
const https = require('https');

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

const minAlias = ['min', 'minute', 'm', 'minutes', 'mins'];
const hourAlias = ['hour', 'hours', 'h', 'hr', 'hrs'];
const nsfw = "Please move to an nsfw channel :flushed:";
const bannedLinks = ['pornhub.com', 'xvideos.com', 'erome.com', 'xnxx.com', 'xhamster.com', 'redtube.com', 'xmov.fun', 'porness.net',
  'youtube.com', 'youtu.be', 'nhentai.net', 'efukt.com', 'hdpornhere.com', 'fm4.ru', 'xvieoxx.com', 'xtube.com', 'youporn.com'
];
// allowed embed endings
const endings = ['.png', '.jpg', '.gif'];
const emojis = ['🍆', '💦', '😳', '🍌', '😏', '🍑', '😊'];
/**
 * A list of all admin commands for the bot.
 */
module.exports.adminCommands = ['set', 'give', 'delete', 'echo', 'clean', 'prefix', 'suggestions'];

const cooldowns = new Discord.Collection();

/**
 * Functions for the bot.
 * @example
 * const tls = require('./tools');
 * const tools = new tls.Tools();
 */
class Tools {
  initCooldown(command) {
    if (!cooldowns.has(command)) {
      cooldowns.set(command, new Discord.Collection());
    }
  }

  addCooldown(command, time, message) {
    if (!cooldowns.has(command)) {
      cooldowns.set(command, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command);
    const cooldown = (time || 0) * 1000;
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldown);
  }

  hasCooldown(command, message) {
    const timestamps = cooldowns.get(command);
    return timestamps.has(message.author.id);
  }

  getTimestamps(command) {
    return cooldowns.get(command);
  }

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

  /**
   * @callback nlMessage
   * @param {number} use Whether the module is being used. Gives a 1 or 0.
   * @param {string} message The message being sent.
   * @param {string} channel The channel being sent the message.
   * @returns {void}
   */

  /**
   * Gets a servers welcomeMessage or leaveMessage options.
   * 
   * @param {string} name Takes either welcomeMessage or leaveMessage
   * @param {string} id The server id to get information from.
   * @param {nlMessage} callback 
   * @example
   * tools.getNLMessage('welcomeMessage', "someserverid", (use, message, channel) => {
   *  // stuff here
   * });
   */
  getNLMessage(name, id, callback) {
    db.get(`SELECT use use, message message, channel channel FROM ${name} WHERE id = ${id}`, (err, row) => {
      if (err) {
        return console.log(err);
      }
      callback(row.use, row.message, row.channel);
    });
  }

  /**
   * @callback prefix
   * @param {string} prefix The servers prefix.
   * @returns {void}
   */

  /**
   * Gets a servers prefix.
   * 
   * @param {string} id The server id to get information from.
   * @param {prefix} callback 
   * @example
   * tools.getPrefix("someserverid", (prefix) => {
   *  // stuff here
   * });
   */
  async getPrefix(id, callback) {
    db.get(`SELECT prefix prefix FROM prefix WHERE id = ${id}`, (err, row) => {
      if (err) return console.log(err);
      callback(row.prefix);
    });
  }

  /**
   * @callback serverInfo
   * @param {number} use Whether the server is using the serverinfo command or not. Returns 1 or 0.
   * @returns {void}
   */

  /**
   * Whether or not a server is using the serverinfo command.
   * 
   * @param {string} id The server id to get information from.
   * @param {serverInfo} callback 
   * @example
   * tools.useServerInfo("someserverid", (use) => {
   *  // stuff here
   * });
   */
  useServerInfo(id, callback) {
    db.get(`SELECT use use FROM serverInfo WHERE id = ${id}`, (err, row) => {
      if (err) return console.log(err);
      callback(row.use);
    });
  }

  /**
   * @callback commandOptions
   * @param {number} everyone Whether the server's custom commands able to be created by everyone or not. Returns 1 or 0.
   * @param {number} use Whether the server is using custom commands or not. Returns 1 or 0.
   * @returns {void}
   */

  /**
   * Gets a servers options for custom commands.
   * 
   * @param {string} id The server id to get information from.
   * @param {commandOptions} callback 
   * @example
   * tools.getCommandOptions("someserverid", (everyone, use) => {
   *  // stuff here
   * });
   */
  getCommandOptions(id, callback) {
    db.get(`SELECT everyone everyone, use use FROM commandOptions WHERE id = ${id}`, (err, row) => {
      if (err) return console.log(err);
      callback(row.everyone, row.use);
    });
  }

  /**
   * @callback defaultRole
   * @param {string} def The servers default role.
   * @param {number} use Whether the server is using default roles or not. Returns 1 or 0.
   * @returns {void}
   */
  /**
   * Gets a servers default role.
   * 
   * @param {string} id The server id to get information from.
   * @param {defaultRole} callback 
   * @example
   * tools.getDefaultRole("someserverid", (def, use) => {
   *  // stuff here
   * });
   */
  getDefaultRole(id, callback) {
    db.get(`SELECT def def, use use FROM roles WHERE id = ${id}`, (err, row) => {
      if (err) return console.log(err);
      callback(row.def, row.use);
    });
  }

  /**
   * @callback gallery
   * @param {Object} body The body of the gallery it returns.
   * @returns {void}
   */

  /**
   * Get gallery information
   * 
   * @param {gallery} callback
   * @example
   * tools.gallery((body) => {
   *  // stuff here
   * });
   */
  gallery(callback) {
    const options = {
      'method': 'GET',
      'hostname': 'api.imgur.com',
      'path': '/3/gallery/hot/viral/day/?showViral=true&mature=false&album_previews=false',
      'headers': {
        'Authorization': 'Client-ID d7cfb4c79f57468'
      }
    };

    const req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        const body = Buffer.concat(chunks);
        callback(JSON.parse(body));
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    const postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; ------WebKitFormBoundary7MA4YWxkTrZu0gW--";
    req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
    req.write(postData);
    req.end();
  }

  /**
   * @callback imgur
   * @param {string} err Error if any.
   * @param {Object} body The body of the image.
   */

  /**
   * 
   * @param {string} hash The hash of the image to find.
   * @param {imgur} callback
   * @example
   * tools.imgur('Kc5jp2o', (err, body) => {
   *  if(err) return console.log(err);
   *  // stuff here
   * });
   */
  imgur(hash, callback) {
    const options = {
      'method': 'GET',
      'hostname': 'api.imgur.com',
      'path': '/3/image/' + hash,
      'headers': {
        'Authorization': 'Client-ID d7cfb4c79f57468'
      }
    };

    const req = https.request(options, function (res) {
      const chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        const body = Buffer.concat(chunks);
        callback(JSON.parse(body).data.error, JSON.parse(body));
      });

      res.on("error", function (error) {
        console.log(error);
      });
    });

    const postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; ------WebKitFormBoundary7MA4YWxkTrZu0gW--";
    req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
    req.write(postData);
    req.end();
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
   * @see #imgur
   * @see #gallery
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

  /**
   * Get an array of all users the bot can see.
   * 
   * @param {Discord.Client} client The client to retrieve users from.
   */
  users(client) {
    return client.users.array();
  }

  /**
   * Mutes a member for the time provided.
   * 
   * @param {string} guildId The id of the guild you want to mute on.
   * @param {string} id The id of the user you want to mute.
   * @param {number} mil The time in milliseconds.
   */
  muteMember(guildId, id, mil) {
    const mute = require('./commands/mod/mute');
    const muted = mute.guilds.get(guildId);
    const timeouts = mute.timeoutsGuilds.get(guildId);
    const mutes = mute.mutesGuilds.get(guildId);
    mutes.set(id, Date.now());
    muted.set(id, mil);
    const timeout = setTimeout(() => {
      muted.delete(id);
      mutes.delete(id);
      timeouts.delete(id);
    }, mil);
    timeouts.set(id, timeout);
    timeout;
  }

  /**
   * Unmutes a member.
   * 
   * @param {string} guildId The id of the guild you want to unmute.
   * @param {string} id The id of the user you want to unmute.
   */
  unmuteMember(guildId, id) {
    const mute = require('./commands/mod/mute');
    const muted = mute.guilds.get(guildId);
    const timeouts = mute.timeoutsGuilds.get(guildId);
    const mutes = mute.mutesGuilds.get(guildId);
    muted.delete(id);
    mutes.delete(id);
    clearTimeout(timeouts.get(id));
    timeouts.delete(id);
  }

  /**
   * Get milliseconds out of a string.
   * To turn the string into hours, the string must include one of these: hour, hours, h, hr, hrs.
   * To turn the string into minutes, the string must include one of these: min, minute, m, minutes, mins.
   * All others will be turned into seconds.
   * 
   * @param {string} object The string that you want to parse time out of.
   * @returns {number} The time parsed from the given string in milliseconds. 
   */
  parseTime(object) {
    if (!parseInt(object)) {
      return new Error(`Provided string either didn't have a number or wasn't a string at all.`);
    }
    let isHour = false;
    let isMinute = false;
    for (let i in hourAlias) {
      if (object.includes(hourAlias[i])) {
        isHour = true;
      } else {
        for (let i2 in minAlias) {
          if (object.includes(minAlias[i2]) && !object.includes(hourAlias[i])) isMinute = true;
        }
      }
    }
    if (isMinute) {
      const minutes = parseInt(object);
      const sec = (minutes * 60);
      const mil = (sec * 1000);
      return mil;
    } else if (isHour) {
      const hours = parseInt(object);
      const sec = (hours * 3600);
      const mil = (sec * 1000);
      return mil;
    } else {
      const sec = parseInt(object);
      const mil = (sec * 1000);
      return mil;
    }
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