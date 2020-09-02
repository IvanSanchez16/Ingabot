import { existePlaylist, registrarPlaylist, asignarCancion } from "../../models/Playlist.js";

function comandosPlaylist(msg, args){
    if ( !args[2] ){
        msg.channel.send('El comando esta incompleto');
        return;
    }
    let segundoArgumento = args[2];
    switch ( segundoArgumento ){
        case 'create':
            crear(msg, args);
            break;
        case 'play':
            break;
        case 'delete':
            break;
        default:
            editarPlaylist(msg, args);
    }
}

function crear(msg, args){
    if ( validarCrear(msg, args) ){
        let nombre = '';
        for ( let i=3 ; i<args.length ; i++ )
            nombre = nombre + args[i] + ' ';
        nombre = nombre.trim();
        registrarPlaylist(nombre.toLocaleLowerCase());
    }
}

async function editarPlaylist(msg, args){
    
}

async function validarCrear(msg, args){
    if( !args[3] ){
        msg.channel.send('Hace falta el nombre de la playlist');
        return false;
    }
    let nombre = '';
    for ( let i=3 ; i<args.length ; i++)
        nombre = nombre + args[i] + ' ';
    nombre.trim();
    let band;
    try {
        band = await existePlaylist(nombre);
    } catch (e) {}
    if ( band ){
        msg.channel.send('Ya existe esa playlist');
        return false;
    }
    return true;
}

export { comandosPlaylist }