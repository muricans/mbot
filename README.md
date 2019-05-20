# mbot
<!--- [![Build Status](https://travis-ci.org/muricans/mbot.svg?branch=master)](https://travis-ci.org/muricans/mbot) -->
<!--- commented out for now -->

[mbot](https://github.com/muricans/mbot) is a discord bot created by [muricans](https://www.twitch.tv/muricanslol)
and edited by [felanbird](https://www.twitch.tv/felanbird)

## Installation
mbot runs using [Node.js](https://nodejs.org/)
mbot also uses [jq](https://stedolan.github.io/jq/download/) However, it can run without jq if you remove the memory variable from the start script.


Clone the reposoitory.
```sh
$ git clone https://github.com/muricans/mbot.git
```

After that is completed run the install script.

```sh
$ chmod +x install.sh
$ ./install.sh
```

When you are finished running the install script, edit the settings.json file to add your token.

```json
{
    "prefix": "!",
    "token": "YOURTOKEN",
    "debug": false,
    "fileLogging": true,
    "memory": 50
}
```

Your installation should now be complete. To run the bot execute the start script.

```sh
$ ./start.sh
```

Should you want to update the bot, simply run the update script.

```sh
$ ./update.sh
```