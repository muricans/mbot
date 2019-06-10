const {
    TextChannel,
    RichEmbed
} = require("discord.js");

/**
 * Builds an embed with a number of pages based on how many are in the RichEmbed array given.
 */
class EmbedBuilder {
    constructor() {
        /**
         * @type {RichEmbed[]}
         */
        this.embedArray = [];
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
     * @param {Discord.RichEmbed} embed The embed to push to the array of embeds.
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
     * Builds the embed.
     */
    build() {
        if (!this.channel || !this.embedArray.length || !this.time) throw new Error('A channel, an array of embeds, and time is required!');
        let page = 0;
        this.channel.send(this.embedArray[page]).then(async sent => {
            await sent.react('◀');
            await sent.react('▶');
            sent.awaitReactions((reaction, user) => {
                if (user.id === sent.author.id) return;
                reaction.remove(user);
                switch (reaction.emoji.name) {
                    case '◀':
                        if (page === 0) return;
                        page--;
                        break;
                    case '▶':
                        if (page === this.embedArray.length - 1) return;
                        page++;
                        break;
                }
                sent.edit(this.embedArray[page]);
            }, {
                time: this.time,
            });
        });
    }
}

module.exports = EmbedBuilder;