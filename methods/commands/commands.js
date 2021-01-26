import ytdl from "ytdl-core"
import Discord from "discord.js"
import { listaDeComandos } from "../../config/listaComandos.js";
import { isComando, comando } from "../messages.js";
import { comandosPlaylist, registrarRecord, reproducirRecord } from "./playlist.js";
import { execute } from "../../config/googleApi.js";
    
function comandos(msg) {  
    if (!servers[msg.guild.id]) {
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
            case 'play':
                reproducirRecord(msg, args);
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
            case 'shuffle':
                barajearCola(msg);
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
const minEspera = 5;
var contError = 0;

function barajearCola(msg){
    var server = servers[msg.guild.id];
    if (!validarCola(msg, server))
        return;
        
    let cola = server.queue;

    for (let i = cola.length - 1; i > 0; i--) {
        let indiceAleatorio = Math.floor(Math.random() * (i + 1));
        let temporal = cola[i];
        cola[i] = cola[indiceAleatorio];
        cola[indiceAleatorio] = temporal;
    }

    msg.channel.send('Cola de reproducción revuelta');
}

function desconectarBot(voiceState){
    var server = servers[voiceState.guild.id];
    if (!server)
        return;
    server.conexion = null;
    server.currentSong = null;
    server.queue = [];
}

function detallesCancion(msg, band, song = null, plName = null) {
    var server = servers[msg.guild.id];
    if (band === 1 && !server.currentSong) {
        msg.channel.send('No hay nada sonando verga');
        return;
    }
    let snippet = band === 1 ? server.currentSong.snippet : song.snippet;
    //Llega como array en ese escenario
    if (band === 5)
        snippet = snippet[0];

    var embed = new Discord.MessageEmbed();
    let title;
    switch (band) {
        case 2:
            title = 'Agregado a la cola';
            break;
        case 3:
            title = 'Agregado a ' + plName;
            break;
        case 5:
            title = 'Eliminado de ' + plName;
            break;
        default:
            title = 'En reproducción';
    }
    let cancion = ( band === 1 ? server.currentSong : song );
    let minDuracion = Math.trunc(cancion.duracion / 60);
    let segDuracion = cancion.duracion % 60;
    if(segDuracion < 10)
        segDuracion = '0'+segDuracion;
    let duracion = `${minDuracion}:${segDuracion}`;
    embed.setTitle(title);
    embed.setDescription(snippet.title + '\nDuración: ('+duracion+')');
    embed.setThumbnail(snippet.thumbnails.high.url);
    embed.setColor([33, 180, 46]);
    embed.setFooter('[' + (band === 1 ? server.currentSong.author.username : song.author.username) + ']');
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

function mostrarCola(msg) {
    var server = servers[msg.guild.id];
    if (!validarCola(msg, server))
        return;
    var embed = new Discord.MessageEmbed();
    let cont = 0;
    var listaDeReproduccion = [];
    let song, minDuracion, segDuracion, duracion;
    server.queue.forEach(cancion => {
        if (cont < 20) {
            minDuracion = Math.trunc(cancion.duracion / 60);
            segDuracion = cancion.duracion % 60;
            if(segDuracion < 10)
                segDuracion = '0'+segDuracion;
            duracion = `${minDuracion}:${segDuracion}`;
            song = {
                name: '#' + (++cont) + '   ' + cancion.snippet.title + `\nDuración: (${duracion})`,
                value: '[' + cancion.author.username + ']'
            }
            listaDeReproduccion.push(song);
        }
    });
    if (cont != server.queue.length)
        embed.setFooter('Y ' + (server.queue.length - cont) + ' más');

    embed.setTitle('Cola de reproduccion');
    embed.addFields(listaDeReproduccion);
    embed.setColor([29, 200, 44]);
    msg.channel.send(embed);
}

function moverBot(voiceChannel){
    var server = servers[voiceChannel.guild.id];
    server.conexion = voiceChannel;
}

function noExistente(msg) {
    //arreglarplaylists(msg);
    msg.channel.send('Ese comando no existe, en el canal de ayuda vienen la lista');
}

function play(connection, msg) {
    var server = servers[msg.guild.id];
    server.bandSalirse = false;

    let cancion = server.queue[0];
    if( !cancion )
        return;
    let rs = ytdl(cancion.link, { filter: "audioonly", quality: "highestaudio" });
    server.dispatcher = connection.play(rs);
    server.dispatcher.setVolumeLogarithmic(cancion.volumen); 

    server.currentSong = cancion;
    server.queue.shift();

    server.dispatcher.on('finish', function () {
        contError = 0;
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
    
    server.dispatcher.on('error', (err) => {
        console.log('Peto');
        if (contError++ >= 5){
            contError = 0;
            cancion = server.queue[0];
            if( !cancion )
                return;
            play(connection, msg);
        }
        server.queue.splice(1,0,cancion);
        play(connection, msg);
    });
    
}

function playPlaylist(canciones, msg) {
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
            nombre: cancion.nombre,
            link: cancion.link,
            duracion: cancion.duracion,
            volumen: cancion.volumen
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

        let id = cancion.id;
        let canal = cancion.snippet.channelTitle;
        canal = quitarEspacios(canal);
        let link = 'https://www.youtube.com/watch?v=' + id.videoId + '&ab_channel=' + canal;
        await ytdl.getBasicInfo(link, { filter: "audioonly", quality: "highestaudio" }).then((value) => {
            cancion.duracion = value.player_response.videoDetails.lengthSeconds;
            let loudness;
            if(!value.player_response.playerConfig){
                loudness = 4;
            } else {
                loudness = value.player_response.playerConfig.audioConfig.loudnessDb;
                if(!loudness)
                    loudness = 4;    
            }
            let fx = (loudness - 23) * (-8 / 74);
            fx = Math.log(fx) / 1.04;
            cancion.volumen = fx;
        });
        cancion.link = link;

        var server = servers[msg.guild.id];
        detallesCancion(msg, (!server.currentSong || !server.conexion ? 4 : 2), cancion);
        registrarRecord(cancion, msg.author.id, msg.guild.id);
        server.queue.push(cancion);

        if (!server.conexion) {
            server.conexion = msg.member.voice.channel;
            
            server.conexion.join().then(function (connection) {
                play(connection, msg);
            });
        }
    }
}

function quitarEspacios(canal){
    let arreglo = canal.split(' ');
    let newCanal = '';
    arreglo.forEach(elemento => {
        newCanal = newCanal + elemento;
    });
    return newCanal;
}

function skip(msg) {
    var server = servers[msg.guild.id];
    if (msg.member.voice.channel != server.conexion) {
        msg.channel.send('No andes cagando el palo a los demás mamón')
        return false;
    }
    if (server.dispatcher) server.dispatcher.end();
}

function validarCola(msg, server) {
    if (!server.conexion) {
        msg.channel.send('Nadie esta reproduciendo música');
        return false;
    }
    if (msg.member.voice.channel != server.conexion) {
        msg.channel.send('No estas en el mismo canal de voz que el bot')
        return false;
    }
    if (server.queue.length === 0) {
        msg.channel.send('Se terminó la cola, solo queda la canción sonante');
        return false;
    }
    return true;
}

function validarLyrics(msg, server) {
    if (!server.currentSong) {
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
    var server = servers[msg.guild.id];
    if (server.conexion && msg.member.voice.channel !== server.conexion) {
        msg.channel.send('Te ganaron el bot, no soy omnipresente.....aún')
        return false;
    }
    if (!args[2]) {
        msg.channel.send("Como que se te olvido el nombre plebe pendejo");
        return false;
    }
    var expReg = new RegExp('^[A-Za-z0-9/-ñáíóúé.]*$');
    for (let i = 2; i < args.length; i++) {
        if (!expReg.test(args[i])) {
            msg.channel.send("No te compliques tanto con los caracteres, pon el nombre y ya verga");
            return false;
        }
    }
    return true;
}


export { comandos, playPlaylist, detallesCancion, moverBot, desconectarBot };