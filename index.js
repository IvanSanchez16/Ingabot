const Discord = require('discord.js');
const { token } = require('./token.json');

const client = new Discord.Client();

client.on('ready', () => {
    console.log('Ya esta el pulibot listo');
});

client.login(token);