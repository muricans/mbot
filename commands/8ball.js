const fs = require('fs');

module.exports = {
  name: '8ball',
  execute(message, args, client) {
    if (args.length === 0) {
      return message.reply('Please add params! !8ball <question>');
    }
    var data = fs.readFileSync('response.json', 'utf8');
    var responses = JSON.parse(data);
    var all = [responses.good, responses.unsure, responses.bad];
    var response = all[Math.floor(Math.random() * all.length)];
    const forsenE = client.emojis.get("572620570966097931");
    const sadChamp = client.emojis.get("572621419251499008");
    const peepoPog = client.emojis.get("572621873393958913");
    switch (response) {
      case responses.good:
        message.channel.send(message.author + " " + responses.good[Math.floor(Math.random() * responses.good.length)] + " " + peepoPog);
        break;
      case responses.unsure:
        message.channel.send(message.author + " " + responses.unsure[Math.floor(Math.random() * responses.unsure.length)] + " " + forsenE);
        break;
      case responses.bad:
        message.channel.send(message.author + " " + responses.bad[Math.floor(Math.random() * responses.bad.length)] + " " + sadChamp);
        break;
    }
  },
};