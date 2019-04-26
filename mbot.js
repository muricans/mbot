// init discord lib
const settings = require('./settings.json');
const package = require('./package.json');
const commands = require('./commands.js');
const Discord = require('discord.js');
const client = new Discord.Client();
var debug = true;

// actions
client.on('ready', async () => {
  console.log('mbot v' + package.version + " has been enabled.");
  //game
  client.user.setPresence({
    satus: 'online',
    game: {
      name: 'Minecraft'
    }
  });
  if (debug) {
    try {
      let link = await client.generateInvite(["ADMINISTRATOR"]);
      console.log(link);
    } catch (err) {
      console.log(err);
    }
  }
});

client.on('messageReactionAdd', async (messageReaction, user) => {
  if (user.bot) return;
});

commands.registerCommands(client);
//login to the client
client.login(settings.token);