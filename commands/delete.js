const fs = require('fs');

module.exports = {
  name: 'delete',
  execute(message, args, client) {
    const weirdChamp = client.emojis.get("572690273247821824");
    let hasAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
    if (!hasAdmin) {
      return message.channel.send(message.author + " You don't have permission to use this command! " + weirdChamp);
    }
    if (args.length < 1) {
      return message.reply('Please add more params! !delete <commandName>');
    }
    const data = fs.readFileSync('commands.json', 'utf8');
    const cmds = JSON.parse(data);
    const cmd = cmds.commands;
    let i, jsonCmd;
    for (i = 0; i < cmd.length; i++) {
      if (cmd[i] === null) {
        continue;
      }
      jsonCmd = cmd[i].name;
      if (args[0] === jsonCmd) {
        delete cmd[i];
        message.channel.send(message.author + " Command " + jsonCmd + " deleted!");
        const json = JSON.stringify(cmds);
        fs.writeFileSync('commands.json', json);
      }
    }
  },
};