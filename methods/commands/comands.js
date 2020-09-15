import ytdl from "ytdl-core"
import Discord from "discord.js"
import Genius from "genius-lyrics"
import genLyrics from "genius-lyrics-api";
import { listaDeComandos } from "../../config/listaComandos.js";
import { isComando, comando } from "../messages.js";
import { comandosPlaylist } from "../commands/playlist.js";
import { execute } from "../../config/googleApi.js";
import { tokenGenius } from "../../config/token.js";

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
                detallesCancion(msg, 1);
                break;
            case 'skip':
                skip(msg);
                break;
            case 'queue':
                mostrarCola(msg);
                break;
            case 'lyrics':
                msg.channel.send('Por el momento no funciona');
                //mostrarLyrics(msg);
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

const g = new Genius.Client(tokenGenius);
const { getLyrics } = genLyrics;
var servers = {};
const minEspera = 5;

function detallesCancion(msg, band, song = null, plName = null) {
    var server = servers[msg.guild.id];
    if (band === 1 && !server.currentSong) {
        msg.channel.send('No hay nada sonando verga');
        return;
    }
    if (band === 1 && Math.floor(Math.random() * 100) === 4) {
        msg.channel.send('Que te valga verga');
        return;
    }
    let snippet = band === 1 ? server.currentSong.snippet : song.snippet;
    //Llega como array en ese escenario
    if ( band === 5 )
        snippet = snippet[0];

    var embed = new Discord.MessageEmbed();
    let title;
    switch(band){
        case 2:
            title = 'Agregado a la cola';
            break;
        case 3:
            title = 'Agregado a ' + plName;
            break;
        case 5:
            title = 'Eliminado de '+ plName;
            break;
        default:
            title = 'En reproduccion';
    }
    embed.setTitle(title);
    embed.setDescription(snippet.title);
    embed.setThumbnail(snippet.thumbnails.high.url);
    embed.setColor([33, 180, 46]);
    embed.setFooter('['+ (band === 1 ? server.currentSong.author.username : song.author.username) +']');
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

function mostrarLyrics(msg){
    var server = servers[msg.guild.id];
    if ( validarLyrics(msg,server) ){
        g.tracks.search( server.currentSong.nombre, {limit: 1} )
        .then(results => {
            var song = results[0];
            var options = {
                apiKey: tokenGenius,
                title: song.title,
                artist: song.artist.name,
                optimizeQuery: true
            }
            getLyrics(options).then( (lyrics) => {
                var embed = new Discord.MessageEmbed();
                embed.setTitle(song.title);
                embed.setDescription(song.artist.name + '\n'+'\n'+'\n' + lyrics)
                embed.setColor([29, 200, 44]);
                embed.setFooter('Lyrics provided by genius');
                msg.channel.send(embed);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }
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

    server.dispatcher = connection.play( ytdl(link, { filter: "audioonly" }) );
    server.currentSong = cancion;
    server.queue.shift();
    server.dispatcher.setVolumeLogarithmic(0.7);

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

function playPlaylist(canciones,msg){
    var server = servers[msg.guild.id];

    //Mezclar arreglo
    for (let i = canciones.length - 1; i > 0; i--) {
		let indiceAleatorio = Math.floor(Math.random() * (i + 1));
		let temporal = canciones[i];
		canciones[i] = canciones[indiceAleatorio];
		canciones[indiceAleatorio] = temporal;
	}

    canciones.forEach(cancion => {
        let song = {
            id: cancion.id[0],
            snippet: cancion.snippet[0],
            nombre: cancion.nombre
        }
        song.author = msg.author;
        server.queue.push(song);
    });

    if (!server.conexion) {
        server.conexion = msg.member.voice.channel;
        server.conexion.join().then(function (connection) {
            play(connection, msg);
        });
    }
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
        cancion.nombre = nombre;
        
        var server = servers[msg.guild.id];
        detallesCancion(msg,( !server.currentSong || !server.conexion ? 4 : 2 ), cancion);
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

function validarLyrics(msg, server){
    if ( !server.currentSong ){
        msg.channel.send('No hay ninguna canción en reproducción');
        return false;
    }
    return true;
}

function validarPlay(args, msg) {
    if (!msg.member.voice.channel) {
        msg.channel.send("Como quieres escuchar algo sin estar en un canal estupido");
        return false;
    }
    if (!args[2]) {
        msg.channel.send("Como que se te olvido el nombre plebe pendejo");
        return false;
    }
    var expReg = new RegExp('^[A-Za-z0-9/-]*$');
    for (let i = 2; i < args.length; i++){
        if ( !expReg.test(args[i]) ){
            msg.channel.send("No te pases de verga que es esa madre");
            return false;
        }
    }
    return true;
}


export { comandos, playPlaylist, detallesCancion };