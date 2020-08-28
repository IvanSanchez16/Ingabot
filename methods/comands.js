import ytdl from "ytdl-core"
import Discord from  "discord.js"
import { listaDeComandos } from "../config/listaComandos.js";
import { isComando,comando } from "./messages.js";

function comandos(msg){
    if ( !isComando(msg.content) ){
        comando(msg,false);
        return;
    }
    let mensaje = msg.content;
    if ( mensaje.startsWith('-puli ') ){
        let args = mensaje.split(' ');
        switch( args[1] ){
            case 'p':
                playSong(msg,args);  
                break;
            case 'skip':
                skip(msg);
                break;
            case 'h':
                listaComandos(msg);
                break;
            default:
                noExistente(msg); //Inserta comando que no existe
        }
        return;
    }
}

var servers = {};
var conexion = null;

function listaComandos(msg){
    const embed = new Discord.MessageEmbed();
    embed.setTitle('Lista de comandos');
    embed.setDescription('Comandos disponibles empezando con -puli')
    embed.addFields(listaDeComandos);
    embed.setColor([29, 200, 44]);
    msg.channel.send(embed);
}

function noExistente(msg){
    msg.channel.send('No se ande inventando comandos compa');
}

function play(connection,msg){
    var server = servers[msg.guild.id];
    server.dispatcher = connection.play( ytdl( server.queue[0], {filter: "audioonly"}) );
    server.queue.shift();

    server.dispatcher.on('finish', function(){
        if ( server.queue[0] ){
            play(connection,msg);
        } else {
            connection.disconnect();
            conexion = null;
        }
    });
}

function playSong(msg,args){
    if ( validarPlay(args,msg) ){
        if ( !servers[msg.guild.id] ){
            servers[msg.guild.id] = {
                queue: []
            }
        }

        var server = servers[msg.guild.id];
        server.queue.push( args[2] );

        if ( !conexion ){
            conexion = msg.member.voice.channel;
            conexion.join().then(function(connection){
                play(connection,msg);
            });
        }
    }
}

function skip(msg){
    var server = servers[msg.guild.id];
    if ( server.dispatcher ) server.dispatcher.end();
}

function validarPlay(args,msg){
    if ( !args[2] ){
        msg.channel.send("Como que se te olvido el link plebe pendejo");
        return false;
    }
    let link = args[2];
    if ( !link.includes('www.youtube.com/watch?') ){
        msg.channel.send("Esa madre no es un link de yt crack");
        return false;
    }
    if ( !msg.member.voice.channel ){
        msg.channel.send("Como quieres escuchar algo sin estar en un canal estupido");
        return false;
    }
    return true;
}


export { comandos };