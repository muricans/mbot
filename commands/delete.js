const fs = require('fs');

module.exports = {
  name: 'delete',
  execute(message, args) {
    let hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(message.author + " You don't have permission to use this command!");
    }
    if (args.length < 1) {
      return message.reply('Please add more params! !delete <commandName>');
    }
    var data = fs.readFileSync('commands.json', 'utf8');
    var cmds = JSON.parse(data);
    var cmd = cmds.commands;
    var i, jsonCmd, jsonMsg;
    for (i = 0; i < cmd.length; i++) {
      if (cmd[i] === null) {
        continue;
      }
      jsonCmd = cmd[i].name;
      if (args[0] === jsonCmd) {
        delete cmd[i];
        message.channel.send(message.author + " Command " + jsonCmd + " deleted!");
        var json = JSON.stringify(cmds);
        fs.writeFileSync('commands.json', json);
      }
    }
  },
};