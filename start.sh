MEMORY=$(cat settings.json | jq '.memory')
node --max-old-space-size=$MEMORY mbot.js
