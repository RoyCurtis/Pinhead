/*
 * Pinhead, the pinning bot
 * Roy Curtis, 2017, MIT license
 */

/* Imports */
const Meta    = require("./package.json");
const Discord = require("discord.js");
const YAML    = require('js-yaml');
const FS      = require('fs');
const Util    = require('util.js');

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

    // Ignore if this happened in the target channel
    if ( channel.name.toLowerCase() === config.pinner.channel.toLowerCase() )
    {
        console.debug(`Reaction happened in the target channel; ignoring`);
        return;
    }

    // Ignore if it's not the superpin emoji
    if ( react.emoji.name.toLowerCase() !== config.pinner.emoji.toLowerCase() )
    {
        console.debug(`${react.emoji.name} is not the reaction we want; ignoring`);
        return;
    }

    // Ignore if this user is not permitted to pin
    if ( !Util.hasRole(user, message.guild, config.pinner.role) )
    {
        console.debug(`${user.tag} not permitted to use superpin; ignoring`);
        return;
    }
}

// Finally, attach handlers and begin operation
client.on('ready', onReady);
client.on('messageReactionAdd', onReaction);
client.login(config.botToken);

