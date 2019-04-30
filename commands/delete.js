const fs = require('fs');

module.exports = {
  name: 'delete',
  execute(message, args) {
    if (args.length < 1) {
      return message.reply('Please add more params! !delete <commandName>');
    }
    var data = fs.readFileSync('commands.json', 'utf8');
    var cmds = JSON.parse(data);
    var cmd = cmds.commands;
    try {
      var i, jsonCmd, jsonMsg;
      for (i = 0; i < cmd.length; i++) {
        jsonCmd = cmd[i].name;
        if (args[0] === jsonCmd) {
          delete cmd[i];
          return message.channel.send(message.author + " Command " + jsonCmd + " deleted!");
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};