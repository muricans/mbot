// init discord lib
const settings = require('./settings.json');
const package = require('./package.json');
const Discord = require('discord.js');
const client = new Discord.Client();

var debug = true;

// actions
client.on('ready', async () => {
  console.log('mbot v' + package.version + " has been enabled.");
  //game
  var games = ['Minecraft', 'Murdering Martine the BOT', 'nymnBridge PewDiePie', 'Acrozze a mega gay', 'This bot was made by me :)', 'help me'];
  setInterval(function() {
    var randomStatus = games[Math.floor(Math.random() * games.length)];
    client.user.setPresence({
      satus: 'online',
      game: {
        name: randomStatus
      }
    });
  }, 5000);
  if (debug) {
    try {
      let link = await client.generateInvite(["ADMINISTRATOR"]);
      console.log(link);
    } catch (err) {
      console.log(err);
    }
    setInterval(function() {
      client.destroy();
    }, 30000);
  }
  /*setInterval(function() {
    var u, user;
    for (u in client.users.array()) {
      var uPoints;
      user = client.users.array()[u];
      db.get("SELECT points FROM users WHERE id = " + user.id.toString(), function(err, row) {
        if (err) {
          console.log(err);
        }
        uPoints = row.points + 10;
      });
      tools.setPoints(uPoints, user.id.toString());
      console.log('Updated ' + user.id.toString() + ' to ' + uPoints);
    }
  }, 10000);*/
});

//login to the client
client.login(settings.token);