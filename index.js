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

// Handles initial connection to discord
function onReady()
{
    console.log(`Logged in as ${client.user.tag}`);
}

/**
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
    {
        console.log(`Reaction happened in the target channel; ignoring`);
        return;
    }

    // Ignore if it's not the superpin emoji
    if ( react.emoji.name.toLowerCase() !== config.pinner.emoji.toLowerCase() )
    {
        console.log(`${react.emoji.name} is not the reaction we want; ignoring`);
        return;
    }

    // Ignore if this user is not permitted to pin
    if ( !Util.hasRole(user, guild, config.pinner.role) )
    {
        console.log(`${user.tag} not permitted to use superpin; ignoring`);
        return;
    }

    // Finally, go ahead and pin it to the channel
    pinMessage(guild, message, user);
}

/**
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

        if (!channel.sendEmbed)
        {
            console.error("Found channel, but it's not a text one!");
            continue;
        }

        found = true;
        break;
    }

    // Balk if target channel not found
    if (!found)
    {
        console.error(`Can't pin message; can't find channel ${config.pinner.channel}`);
        return;
    }

    // Finally, prepared the pinned message and pin it!
    let embed = new Discord.RichEmbed({
        author: user
    }).addField("message", message.content, true);

    channel.sendEmbed(embed)
        .then(_ => console.log(`Pinned ${user.tag}'s message: ${message.content}`))
        .catch(console.error);
}

// Finally, attach handlers and begin operation
client.on('ready', onReady);
client.on('messageReactionAdd', onReaction);
client.login(config.botToken);

