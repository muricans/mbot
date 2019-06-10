const {
    TextChannel,
    RichEmbed,
    Message
} = require("discord.js");
const {
    event,
} = require('./mbot');

/**
 * Builds an embed with a number of pages based on how many are in the RichEmbed array given.
 */
class EmbedBuilder {
    constructor() {
        /**
         * @type {RichEmbed[]}
         */
        this.embedArray = [];
        /**
         * @type {boolean}
         */
        this.hasColor = false;
        /**
         * @type {object[]}
         */
        this.emojis = [];
    }

    /**
     * 
     * @param {TextChannel} channel The channel the embed will be sent to.
     */
    setChannel(channel) {
        this.channel = channel;
        return this;
    }

    /**
     * 
     * @param {RichEmbed[]} embedArray The array of embeds to use.
     */
    setEmbeds(embedArray) {
        this.embedArray = embedArray;
        return this;
    }

    /**
     * 
     * @param {number} time The amount of time the bot will allow reactions for.
     */
    setTime(time) {
        this.time = time;
        return this;
    }

    /**
     * 
     * @param {RichEmbed} embed The embed to push to the array of embeds.
     */
    addEmbed(embed) {
        this.embedArray.push(embed);
        return this;
    }

    /**
     * @returns {RichEmbed[]} The current embeds that this builder has.
     */
    getEmbeds() {
        return this.embedArray;
    }

    /**
     * 
     * @param {string} title 
     */
    setTitle(title) {
        this._all((i) => {
            this.embedArray[i].setTitle(title);
        });
        return this;
    }

    /**
     * 
     * @param {*} text 
     * @param {string} [icon]
     */
    setFooter(text, icon) {
        this._all((i) => {
            this.embedArray[i].setFooter(text, icon);
        });
        return this;
    }

    /**
     * 
     * @param {*} name 
     * @param {*} value 
     * @param {boolean} [inline]
     */
    addField(name, value, inline) {
        this._all((i) => {
            this.embedArray[i].addField(name, value, inline);
        });
        return this;
    }

    /**
     * 
     * @param {string} url 
     */
    setURL(url) {
        this._all((i) => {
            this.embedArray[i].setURL(url);
        });
        return this;
    }

    /**
     * 
     * @param {*} name 
     * @param {string} [icon] 
     * @param {string} [url] 
     */
    setAuthor(name, icon, url) {
        this._all((i) => {
            this.embedArray[i].setAuthor(name, icon, url);
        });
        return this;
    }

    /**
     * 
     * @param {Date|number} [timestamp] 
     */
    setTimestamp(timestamp) {
        this._all((i) => {
            this.embedArray[i].setTimestamp(timestamp);
        });
        return this;
    }

    _all(index) {
        for (let i = 0; i < this.embedArray.length; i++)
            index(i);
    }

    /**
     * Set the emoji for going backwards.
     * 
     * @param {string} unicodeEmoji 
     */
    setBackEmoji(unicodeEmoji) {
        this.back = unicodeEmoji;
        return this;
    }

    /**
     * Set the emoji for going forward.
     * 
     * @param {string} unicodeEmoji 
     */
    setNextEmoji(unicodeEmoji) {
        this.next = unicodeEmoji;
        return this;
    }

    /**
     * Set the emoji to stop the embed from listening for reactions.
     * 
     * @param {string} unicodeEmoji 
     */
    setStopEmoji(unicodeEmoji) {
        this.stop = unicodeEmoji;
        return this;
    }

    /**
     * Set the emoji to go to the first page.
     * 
     * @param {string} unicodeEmoji 
     */
    setFirstEmoji(unicodeEmoji) {
        this.first = unicodeEmoji;
        return this;
    }

    /**
     * Set the emoji to go the the last page.
     * 
     * @param {string} unicodeEmoji 
     */
    setLastEmoji(unicodeEmoji) {
        this.last = unicodeEmoji;
        return this;
    }

    /**
     * @callback addEmoji
     * @param {Message} sent
     * @param {EmbedBuilder} builder
     */

    /**
     * Add an emoji which will perform it's own action when pressed.
     * 
     * @param {string} unicodeEmoji 
     * @param {addEmoji} func 
     */
    addEmoji(unicodeEmoji, func) {
        this.emojis.push({
            emoji: unicodeEmoji,
            do: func,
        });
        return this;
    }

    /**
     * 
     * @param {*} color 
     */
    setColor(color) {
        this._all((i) => {
            this.embedArray[i].setColor(color);
        });
        this.hasColor = true;
        return this;
    }

    _setColor(color) {
        this._all((i) => {
            this.embedArray[i].setColor(color);
        });
        return this;
    }

    /**
     * Builds the embed.
     */
    build() {
        if (!this.channel || !this.embedArray.length || !this.time) throw new Error('A channel, an array of embeds, and time is required!');
        const back = this.back ? this.back : '◀';
        const first = this.first ? this.first : '⏪';
        const stop = this.stop ? this.stop : '⏹';
        const last = this.last ? this.last : '⏩';
        const next = this.next ? this.next : '▶';
        if (!this.hasColor)
            this._setColor(0x2872DB);
        let page = 0;
        this.channel.send(this.embedArray[page]).then(async sent => {
            await sent.react(back);
            await sent.react(first);
            await sent.react(stop);
            await sent.react(last);
            await sent.react(next);
            if (this.emojis.length !== 0) {
                for (let i = 0; i < this.emojis.length; i++)
                    await sent.react(this.emojis[i].emoji);
            }
            const collection = sent.createReactionCollector((reaction, user) => user.id !== sent.author.id && reaction.remove(user), {
                time: this.time,
            }).on('end', () => {
                if (!this.hasColor)
                    this._setColor(0xE21717);
            });
            collection.on('collect', reaction => {
                switch (reaction.emoji.name) {
                    case first:
                        page = 0;
                        break;
                    case back:
                        if (page === 0) return;
                        page--;
                        break;
                    case stop:
                        collection.stop();
                        break;
                    case next:
                        if (page === this.embedArray.length - 1) return;
                        page++;
                        break;
                    case last:
                        page = this.embedArray.length - 1;
                        break;
                }
                for (let i = 0; i < this.emojis.length; i++) {
                    if (reaction.emoji.name === this.emojis[i].emoji)
                        return this.emojis[i].do(sent, this);
                }
                sent.edit(this.embedArray[page]);
            });
        });
    }
}

module.exports = EmbedBuilder;