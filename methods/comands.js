import ytdl from "ytdl-core"
import Discord from  "discord.js"
import { listaDeComandos } from "../config/listaComandos.js";
import { isComando,comando } from "./messages.js";
import { registrarCancion, obtenerCancion, cancionesDisponibles, borrarCancion } from "../config/database.js";

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
            case 'list':
                listaCanciones(msg);
                break;
            case 'skip':
                skip(msg);
                break;
            case 'help':
                listaComandos(msg);
                break;
            case 'delete':
                if ( !borrarRegistro(msg, args) )
                    return;
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

async function borrarRegistro(msg, args){
    if ( validarEliminar(msg, args) ){
        let nomCancion = args[2];
        try {
            var bandBorrado = await borrarCancion( nomCancion.toLocaleLowerCase() );
        }catch(e){
            console.log(e);
        }
        if ( bandBorrado.deletedCount < 1 ){
            msg.channel.send('No se que pedo pero no se borro jaja salu2');
            return false;
        }
        return true;
    }
    return false;
}

async function listaCanciones(msg){
    var lista = [];
    try {
        var canciones = await cancionesDisponibles();
    }catch(e){
        console.log(e);
    }
    canciones.forEach(cancion => {
        lista.push({
            name: cancion.name,
            value: cancion.link
        });
    });
    var embed = new Discord.MessageEmbed();
    embed.setTitle('Lista de canciones');
    embed.setDescription('Canciones registradas')
    embed.addFields(lista);
    embed.setColor([33, 180, 46]);
    msg.channel.send(embed);
}

function listaComandos(msg){
    var embed = new Discord.MessageEmbed();
    embed.setTitle('Lista de comandos');
    embed.setDescription('Comandos disponibles empezando con -puli')
    embed.addFields(listaDeComandos);
    embed.setColor([29, 200, 44]);
    embed.setFooter('Reacciona con una 💩 cuando el comando tiene exito');
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
            conexion = null;
            setTimeout(()=>{
                if ( !conexion )
                    connection.disconnect();
            },1000 * (60 * minEspera)); //5 min de espera para salirse
        }
    });
}

async function playSong(msg,args){
    if ( validarPlay(args,msg) ){
        if ( !servers[msg.guild.id] ){
            servers[msg.guild.id] = {
                queue: []
            }
        }
        
        let segundoArg = args[2];
        if ( !segundoArg.includes('www.youtube.com/watch?') ){//-puli p nombre_cancion
            try {
                var link = await obtenerCancion(segundoArg.toLocaleLowerCase());
              } catch(e) {
                console.log(e);
              }
        } else { //-puli p link && -puli p link nombre
            link = segundoArg;
            if ( args[3] ){
                let nombre = args[3];
                if ( !registrarCancion(nombre.toLocaleLowerCase(), link) )
                    msg.channel.send('Esa cancion ya fue registrada con otro nombre, buscala huevon')
            } 
        }
        
        if ( !link ){
            msg.channel.send('Esa cancion no esta registrada, registrela huevon')
            return;
        }

        var server = servers[msg.guild.id];
        server.queue.push( link );

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

function validarEliminar(msg, args){
    if ( !args[2] ){
        msg.channel.send("Ahorita elimino esa cancion llamada       ,pendejo");
        return false;
    }
    if ( !obtenerCancion( args[2] ) ){
        msg.channel.send("Ve y registrala primero para poder borrarla");
        return false;
    }
    return true;
}

function validarPlay(args,msg){
    if ( !args[2] ){
        msg.channel.send("Como que se te olvido el link o el nombre plebe pendejo");
        return false;
    }
    if ( !msg.member.voice.channel ){
        msg.channel.send("Como quieres escuchar algo sin estar en un canal estupido");
        return false;
    }
    return true;
}


export { comandos };