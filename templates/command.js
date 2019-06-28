/* eslint-disable */
// Command template
module.exports = {
    name: 'commandName',
    // OPTIONAL
    usage: '<usageHere>',
    // OPTIONAL
    description: 'My commands description',
    // OPTIONAL
    nsfw: true,
    // OPTIONAL
    args: true,
    // If above is true, this is NOT optional
    minArgs: 1,
    // OPTIONAL - This adds extra protection for the bot running this command.
    mod: true,
    // OPTIONAL - This makes it so only the owner can execute this command.
    owner: true,
    // OPTIONAL - Permissions needed to run this command
    permissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
    /**
     * 
     * @param {Discord.Message} message The message that was received by the bot
     * @param {string[]} args Arguments attached to message (not including prefix & command)
     * @param {Discord.Client} client The bots Discord client
     * @param {string} prefix Prefix of the current guild
     * @param {BetterSqlite3.Database} db The bots database
     * @param {string[]} nsfwCmds List of all nsfw commands for the bot
     */
    execute(message, args, client, prefix, db, nsfwCmds) {
        // Command code here
    },
};