npm install discord.js
npm install snekfetch
npm install sqlite3

chmod +x update.sh
chmod +x start.sh

curl https://muricans.github.io/settings.json -o settings.json

git show --format="%h" --no-patch > version.txt

echo Installation complete. To run the bot, add your token to settings.json where "token": is. After that, run the start script.