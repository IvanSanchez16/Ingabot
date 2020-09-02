import ytdl from "ytdl-core"
import Discord from "discord.js"
import { listaDeComandos } from "../../config/listaComandos.js";
import { isComando, comando } from "../messages.js";
import { comandosPlaylist } from "../commands/playlist.js";
import { execute } from "../../config/googleApi.js";

function comandos(msg) {
    if ( !servers[msg.guild.id] ) {
        servers[msg.guild.id] = {
            queue: [],
            conexion: null,
            currentSong: null,
            bandSalirse: false
        }
    }
    if (!isComando(msg.content)) {
        comando(msg, false);
        return;
    }
    let mensaje = msg.content;
    if (mensaje.startsWith('-puli ')) {
        let args = mensaje.split(' ');
        switch (args[1]) {
            case 'p':
                playSong(msg, args);
                break;
            case 'cs':
                cancionActual(msg);
                break;
            case 'skip':
                skip(msg);
                break;
            case 'queue':
                mostrarCola(msg);
                break;
            case 'help':
                listaComandos(msg);
                break;
            case 'pl':
                comandosPlaylist(msg, args);
                break;
            default:
                noExistente(msg); //Inserta comando que no existe
                return;
        }
        msg.react('💩')
            .then()
            .catch(console.error)
        return;
    }
}

var servers = {};
var conexion = null;
const minEspera = 5;

function cancionActual(msg) {
    var server = servers[msg.guild.id];
    if (!server.currentSong) {
        msg.channel.send('No hay nada sonando verga');
        return;
    }
    if (Math.floor(Math.random() * 100) === 4) {
        msg.channel.send('Que te valga verga');
        return;
    }
    let snippet = server.currentSong.snippet;
    var embed = new Discord.MessageEmbed();
    embed.setTitle('En reproduccion');
    embed.setDescription(snippet.title);
    embed.setThumbnail(snippet.thumbnails.high.url);
    embed.setColor([33, 180, 46]);
    embed.setFooter('['+server.currentSong.author.username+']');
    msg.channel.send(embed);
}

function mostrarCola(msg){
    var server = servers[msg.guild.id];
    if (!validarCola(msg,server)) 
        return;
    var embed = new Discord.MessageEmbed();
    let cont = 0;
    var listaDeReproduccion = [];
    let song;
    server.queue.forEach(cancion => {
        if ( cont < 15 ){
            song = {
                name: '#' + (++cont) + '   ' + cancion.snippet.title,
                value: '[' + cancion.author.username + ']'
            }
            listaDeReproduccion.push(song);    
        } 
    });
    if ( cont != server.queue.length )
        embed.setFooter('Y ' + server.queue.length - cont + ' mas');

    embed.setTitle('Cola de reproduccion');
    embed.addFields(listaDeReproduccion);
    embed.setColor([29, 200, 44]);
    msg.channel.send(embed);
}

function listaComandos(msg) {
    var embed = new Discord.MessageEmbed();
    embed.setTitle('Lista de comandos');
    embed.setDescription('Comandos disponibles empezando con -puli')
    embed.addFields(listaDeComandos);
    embed.setColor([29, 200, 44]);
    embed.setFooter('Reacciona con una 💩 cuando el comando tiene exito');
    msg.channel.send(embed);
}

function noExistente(msg) {
    msg.channel.send('No se ande inventando comandos compa');
}

function play(connection, msg) {
    var server = servers[msg.guild.id];
    server.bandSalirse = false;

    let cancion = server.queue[0];
    let id = cancion.id;
    let link = 'www.youtube.com/watch?v=' + id.videoId;

    server.dispatcher = connection.play(ytdl(link, { filter: "audioonly" }));
    server.currentSong = cancion;
    server.queue.shift();

    server.dispatcher.on('finish', function () {
        if (server.queue[0]) {
            play(connection, msg);
        } else {
            server.conexion = null;
            server.bandSalirse = true;
            setTimeout(() => {
                if (!server.conexion && server.bandSalirse)
                    connection.disconnect();
            }, 1000 * (60 * minEspera)); //5 min de espera para salirse
        }
    });
}

async function playSong(msg, args) {
    if (validarPlay(args, msg)) {
        

        let nombre = '';
        for (let i = 2; i < args.length; i++)
            nombre = nombre + args[i] + ' ';
        nombre = nombre.trim();
        try {
            var cancion = await execute(nombre);
        } catch (error) {
            console.log(error);
        }
        cancion.author = msg.author;
        
        var server = servers[msg.guild.id];
        server.queue.push(cancion);

        if (!server.conexion) {
            server.conexion = msg.member.voice.channel;
            server.conexion.join().then(function (connection) {
                play(connection, msg);
            });
        }
    }
}

function skip(msg) {
    var server = servers[msg.guild.id];
    if (server.dispatcher) server.dispatcher.end();
}

function validarCola(msg,server){
    if ( !server.conexion ){
        msg.channel.send('Nadie esta reproduciendo música');
        return false;
    }
    if (msg.member.voice.channel != server.conexion){
        msg.channel.send('No estas en el mismo canal de voz que el bot')
        return false;
    }
    if ( server.queue.length === 0 ){
        msg.channel.send('Se terminó la cola, solo queda la canción sonante');
        return false;
    }
    return true;
}

function validarPlay(args, msg) {
    if (!args[2]) {
        msg.channel.send("Como que se te olvido el nombre plebe pendejo");
        return false;
    }
    if (!msg.member.voice.channel) {
        msg.channel.send("Como quieres escuchar algo sin estar en un canal estupido");
        return false;
    }
    return true;
}


export { comandos };