**Pinhead** is a simple Discord bot that pins messages to a specific channel. This is a
workaround for Discord's per-channel 50 pin limit.

# Installation

1. `git clone https://github.com/RoyCurtis/Pinhead.git pinhead && cd pinhead`
1. `npm install` - Installs dependencies
1. Copy `config.yml.example` to `config.yml` and fill in the required values
1. `node index.js` - Runs the bot
1. Setup a specific role (e.g. `pinner`) to allow users to pin messages
    * This is optional; leave `role` blank to allow anybody to pin
1. Setup a custom emoji, or specify a built-in emoji, to use as the pin trigger reaction
1. Setup the target channel as a _text_ channel (e.g. `#memes`)

# Usage

1. User sees amusing message and reacts to it using the configured superpin emoji
1. Bot goes ahead and copies the message to the configured channel

# Limitations

* The bot will not unpin messages; that is up to anybody with message management perms
* [Due to issues with Discord.js][1], only the previous 100 messages + any the bot has
seen since running, are pinnable

[1]: https://github.com/hydrabolt/discord.js/issues/1675
