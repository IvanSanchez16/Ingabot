import ytdl from "ytdl-core";

function Comandos(msg){
    let mensaje = msg.content;
    if ( mensaje.startsWith('-puli ') ){
        let args = mensaje.split(' ');
        switch( args[1] ){
            case 'p':
                Play(msg,args);  
                break;
            case 'skip':
                Skip(msg);
                break;
        }
        return;
    }
}

var servers = {};
var conexion = null;

function Play(msg,args){
    if ( ValidarPlay(args,msg) ){
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

function Skip(msg){
    var server = servers[msg.guild.id];
    if ( server.dispatcher ) server.dispatcher.end();
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

function ValidarPlay(args,msg){
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

export { Comandos };