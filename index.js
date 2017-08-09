/*
 * Pinhead, the pinning bot
 * Roy Curtis, 2017, MIT license
 */

/* Imports */
const Discord = require("discord.js");
const YAML    = require('js-yaml');
const FS      = require('fs');

/* Globals */
const config = YAML.safeLoad( FS.readFileSync('config.yml', 'utf8') );
const client = new Discord.Client();

/* Main logic */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
    msg.reply('Pong!');
}
});

client.login('token');