//import { client_secret, client_id } from "../config/token.js";
import fetch from "node-fetch";
import Discord from "discord.js"
import { getStreamers, registrarStreamer, actualizarEstado } from "../models/Streamer.js";
import { client } from "../config/client.js";

const client_id = process.env.client_id
const client_secret = process.env.client_secret;

var bearer_token;
var streamers;

async function streamAlert() {
    await actualizaToken();
    checarLiveListener();
}

function checarLiveListener() {
    setTimeout(() => {
        checaLive();
        checarLiveListener();
    }, 1000 * 70);
}

async function actualizaToken() {
    bearer_token = await getBearerToken();
    setTimeout(() => {
        actualizaToken();
    }, bearer_token.expires_in);
}

async function checaLive() {
    streamers = await getStreamers();
    streamers.forEach(async (streamer) => {
        try {
            var data = await getChannel(streamer.channel);
        } catch (error) {} 
        if ( data ){
            let islive = data.is_live;
            if (!streamer.islive && islive) { //inicio
                actualizarEstado(streamer.name);
                enviarMensaje(streamer, data);
            } else if (streamer.islive && !islive) { //termino
                actualizarEstado(streamer.name);
            }
        }
    });
}

function enviarMensaje(streamer, data) {
    var guild = client.guilds.cache.find(server => server.name === 'IngaDiscord');
    var channel = guild.channels.cache.find(ch => ch.name === 'anuncios-streamers');
    channel.send(`Hey vergas @everyone, ${streamer.name} acaba de iniciar directo. Caeganle a pasar un buen rato`)
    var embed = new Discord.MessageEmbed();
    embed.setTitle(data.title);
    embed.addField(`https://www.twitch.tv/${streamer.channel}`, data.game);
    embed.setThumbnail(data.thumbnail_url)
    embed.setColor([127, 33, 180]);
    channel.send(embed);
}

async function getChannel(canal) {
    let response = await fetch(`https://api.twitch.tv/helix/search/channels?query=${canal}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearer_token.access_token}`,
                "Client-Id": client_id
            }
        });
    let data;
    try {
        data = await response.json();
    } catch (error) {}
    let gameid = data.data[0];
    let response2 = await fetch(`https://api.twitch.tv/helix/games?id=${gameid.game_id}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearer_token.access_token}`,
                "Client-Id": client_id
            }
        });
    let game;
    try {
        game = await response2.json();
    } catch (e) {}
    let gamess = game.data[0];
    if (typeof gamess === 'undefined'){
        gameid.game = 'Sin juego';
        return data.data[0];
    }
    gameid.game = gamess.name;
    return data.data[0];
}

async function getBearerToken() {
    let response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${client_id}&grant_type=client_credentials&client_secret=${client_secret}`,
        {
            method: 'POST'
        });
    let data = await response.json();
    return data;
}

export { streamAlert }