const fs = require('fs');

module.exports = {
  name: '8ball',
  usage: '<question>',
  description: 'Ask the bot a question',
  cooldown: 1,
  args: true,
  minArgs: 1,
  execute(message) {
    fs.readFile('response.json', 'utf8', (err, data) => {
      if (err) return console.log(err);
      const res = JSON.parse(data).responses;
      const randomRes = res[Math.floor(Math.random() * res.length)];
      let emotes;
      switch (randomRes.type) {
        case "good":
          emotes = ["<:peepoPog:572621873393958913>", "<:ThanosSmile:566861749324873738>"];
          message.channel.send(`${message.author} ${randomRes.response} ${emotes[Math.floor(Math.random() * emotes.length)]}`);
          break;
        case "unsure":
          emotes = ["<:forsenE:462106457429639179>", "<:Pepege:568221587912917002>"];
          message.channel.send(`${message.author} ${randomRes.response} ${emotes[Math.floor(Math.random() * emotes.length)]}`);
          break;
        case "bad":
          emotes = ["<:SadChamp:572621419251499008>", "<:peepoWTF:567905581868777492>"];
          message.channel.send(`${message.author} ${randomRes.response} ${emotes[Math.floor(Math.random() * emotes.length)]}`);
          break;
      }
    });
  },
};