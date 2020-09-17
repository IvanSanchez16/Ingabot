
function comandosCine(msg){
    var mensaje = msg.content;
    var args = mensaje.split(' ');
    if ( args[0] === '-puli' ){
        comandos(msg, args);
        return;
    }
}

function comandos(msg, args){
    if ( validarComando(msg, args) ){
        var canalId = msg.member.voice.channel.id;
        var canal = msg.guild.channels.cache.get(canalId);
        var rolTodos = msg.guild.roles.cache.find( role => role.name === '@everyone' );
        var permiso = 'CONNECT';
        switch(args[1]){
            case 'close':
                canal.overwritePermissions([
                    {
                        id: rolTodos.id,
                        deny: permiso
                    }
                ]);
                msg.channel.send(`Se cerró la ${canal.name}, disfrute de la función`);
                break;
            case 'open':
                canal.overwritePermissions([
                    {
                        id: rolTodos.id,
                        allow: permiso
                    }
                ]);
                msg.channel.send(`Se abrió nuevamente la ${canal.name}`);
                break; 
            default:
                msg.channel.send(`Dentro de éste canal solo puedes cerrar y abrir las salas`);
        }
    }
}

function validarComando(msg, args){
    if( args.length < 2 ){
        msg.channel.send('No puedo hacer nada si nomás pones -puli');
        return false;
    }
    let canalVoz = msg.member.voice.channel;
    if ( !canalVoz ){
        msg.channel.send('Primero entra a alguna Sala para poder invocar comandos');
        return false;
    }
    if ( !canalVoz.name.startsWith('Sala ') ){
        msg.channel.send('Tienes que estar dentro de una sala del cinefilo mamador');
        return false;
    }
    return true;
}

export { comandosCine }