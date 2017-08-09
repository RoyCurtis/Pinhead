/*
 * Pinhead, the pinning bot
 * Roy Curtis, 2017, MIT license
 */

/* Imports */
const Meta    = require("./package.json");
const Discord = require("discord.js");
const FS      = require('fs');
const Util    = require('./util');
const YAML    = require('js-yaml');

/* Globals */
console.log(`*** Starting Pinhead ${Meta.version} ***`);

const config = YAML.safeLoad( FS.readFileSync('./config.yml', 'utf8') );
const client = new Discord.Client();

/* Event handlers */

/** Caches messages upon connection to discord */
function onReady()
{
    console.log(`Logged in as ${client.user.tag}; caching all recent messages...`);

    /*
     * For some very unfortunate reason(s), discord.js requires that messages be loaded
     * and cached, in order to catch `messageReactionAdd` events on them. Why it can't
     * simply be that Discord fires the event anyway or discord.js handle it, who knows...
     * See https://github.com/hydrabolt/discord.js/issues/1675
     */

    /** @type {Guild} */
    let guild   = null;
    /** @type {TextChannel|VoiceChannel} */
    let channel = null;

    for ( guild   of client.guilds.values() )
    for ( channel of guild.channels.values() )
    {
        const channelName = channel.name;

        // Skip non-text channels
        if (!channel.fetchMessages) continue;

        // Max limit is 100 messages...
        channel.fetchMessages({limit: 100})
            .then(messages => {
                console.log(`Received ${messages.size} messages for #${channelName}`)
            })
            .catch(console.error);
    }
}

/**
 * Handles reactions added to (almost) any message in channels
 *
 * @param {MessageReaction} react
 * @param {User} user
 */
function onReaction(react, user)
{
    const message = react.message;
    const channel = message.channel;
    const guild   = message.guild;

    // Ignore if this happened in the target channel
    if ( channel.name.toLowerCase() === config.pinner.channel.toLowerCase() )
        return;

    // Ignore if it's not the superpin emoji
    if ( react.emoji.name.toLowerCase() !== config.pinner.emoji.toLowerCase() )
        return;

    // Ignore if this user is not permitted to pin
    if ( !Util.hasRole(user, guild, config.pinner.role) )
        return;

    // Finally, go ahead and pin it to the channel
    pinMessage(guild, message, user);
}

/**
 * Handles the pinning of a message to the pin channel
 *
 * @param {Guild} guild
 * @param {Message} message
 * @param {User} user
 */
function pinMessage(guild, message, user)
{
    /** @type {TextChannel|VoiceChannel} */
    let channel = null;
    let found   = false;

    // Search for target channel
    for ( channel of guild.channels.values() )
    {
        if (channel.name.toLowerCase() !== config.pinner.channel)
            continue;

        // Skip non-text channels
        if (!channel.send)
        {
            console.error(`Found channel "${channel.name}", but it's not a text one!`);
            continue;
        }

        found = true;
        break;
    }

    // Balk if target channel not found
    if (!found)
    {
        console.error(`Can't pin message; can't find channel #${config.pinner.channel}`);
        return;
    }

    // Finally, prepared the pinned message and pin it!
    let pinMessage = [
        `${user} pinned a message by ${message.author}:`,
        `---`,
        `<**${message.createdAt.toLocaleString()}**> ${message.content}`
    ];

    channel.send(pinMessage)
        .then(_ => console.log(`Pinned ${user.tag}'s message: "${message.content}"`))
        .catch(console.error);
}

// Finally, attach handlers and begin operation
client.on('ready', onReady);
client.on('messageReactionAdd', onReaction);
client.login(config.botToken);

