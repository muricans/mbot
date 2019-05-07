# mbot
<!--- [![Build Status](https://travis-ci.org/muricans/mbot.svg?branch=master)](https://travis-ci.org/muricans/mbot) -->
<!--- commented out for now -->

mbot is a discord bot created by [muricans](https://www.twitch.tv/muricanslol)
and edited by [felanbird](https://www.twitch.tv/felanbird)

## Installation
mbot runs using [Node.js](https://nodejs.org/)

Clone the reposoitory and make a settings.json file in the root of where you cloned the git.

```json
{
    "prefix": "!",
    "token": "BOT_TOKEN_HERE",
    "debug": false,
    "memory": 50
}
```

After that is completed install the needed dependencies.

```sh
$ npm install discord.js
$ npm install snekfetch
$ npm install sqlite3
```
When you are finished installing the dependencies,run the start.sh script.
You may need to give the script permissions to run, you can do so by entering the following.

```sh
$ chmod +x start.sh
```

Your installation should now be complete.