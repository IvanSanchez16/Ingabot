import { existePlaylist, registrarPlaylist, asignarCancion, obtenerCanciones, borrarPl, buscarCancion, removerCancion } from "../../models/Playlist.js";
import { execute } from "../../config/googleApi.js";
import { playPlaylist, detallesCancion } from "./comands.js";

function comandosPlaylist(msg, args) {
    if (!args[2]) {
        msg.channel.send('El comando esta incompleto');
        return;
    }
    let servidor = msg.guild.id;
    let segundoArgumento = args[2];
    switch (segundoArgumento) {
        case 'create':
            crear(msg, args, servidor);
            break;
        case 'play':
            reproducirPl(msg, args);
            break;
        case 'delete':
            borrarPlaylist(msg, args, servidor);
            break;
        default:
            editarPlaylist(msg, args, servidor);
    }
}

async function borrarPlaylist(msg, args, servidor){
    let band;
    try{
        band = await validarBorrar(msg, args, servidor);
    }catch(e){}
    if ( band ) {
        let nombre = '';
        for (let i = 3; i < args.length; i++)
            nombre = nombre + args[i] + ' ';
        nombre = nombre.trim();
        borrarPl(nombre, servidor);
    }
}

async function crear(msg, args, servidor) {
    let band;
    try{
        band = await validarCrear(msg, args, servidor);
    }catch(e){}
    if ( band ) {
        let nombre = '';
        for (let i = 3; i < args.length; i++)
            nombre = nombre + args[i] + ' ';
        nombre = nombre.trim();
        let creador = msg.author.id;
        registrarPlaylist(nombre.toLocaleLowerCase(),creador,servidor);
    }
}

async function editarPlaylist(msg, args, servidor) {
    if (msg.content.includes('add')) {
        let playlist = '';
        let i;
        for (i = 2; i < args.length && args[i] !== 'add'; i++)
            playlist = playlist + args[i] + ' ';
        playlist = playlist.trim();

        i++;
        let cancion = '';
        for (let k = i; k < args.length; k++)
            cancion = cancion + args[k] + ' ';
        cancion = cancion.trim();
        try {
            var song = await execute(cancion);
        } catch (error) { console.log(error) }
        console.log(song);
        song.nombre = cancion;
        song.author = msg.author;

        detallesCancion(msg, 3, song, playlist);
        asignarCancion(playlist, song, servidor);
        return;
    }
    if (msg.content.includes('remove')) {
        let playlist = '';
        let i;
        for (i = 2; i < args.length && args[i] !== 'remove'; i++)
            playlist = playlist + args[i] + ' ';
        playlist = playlist.trim();
        i++;
        let cancion = '';
        for (let k = i; k < args.length; k++)
            cancion = cancion + args[k] + ' ';
        cancion = cancion.trim();
        let band;
        try{
            band = await buscarCancion(playlist,cancion,servidor);
        }catch(e){}
        if ( !band ) {
            msg.channel.send('No se encontro la cancion dentro de la playlist');
            return;
        }
        band.author = msg.author;
        detallesCancion(msg, 5, band, playlist);
        removerCancion(playlist, servidor, band.index);
        return;
    }
    msg.channel.send('Elige correctamente una opción')
    return;
}

async function reproducirPl(msg, args) {
    let playlist = '';
    let i;
    for (i = 3; i < args.length ; i++)
        playlist = playlist + args[i] + ' ';
    playlist = playlist.trim();

    try {
        var canciones = await obtenerCanciones( playlist.toLocaleLowerCase() );
    } catch (error) { console.log(error); }

    playPlaylist(canciones,msg);
}

async function validarCrear(msg, args, servidor) {
    if (!args[3]) {
        msg.channel.send('Hace falta el nombre de la playlist');
        return false;
    }
    let nombre = '';
    for (let i = 3; i < args.length; i++)
        nombre = nombre + args[i] + ' ';
    nombre = nombre.trim();
    let band;
    try {
        band = await existePlaylist(nombre, servidor);
    } catch (e) {}
    if (band) {
        msg.channel.send('Ya existe esa playlist');
        return false;
    }
    return true;
}

async function validarBorrar(msg, args, servidor){
    if (!args[3]) {
        msg.channel.send('Hace falta el nombre de la playlist');
        return false;
    }
    let nombre = '';
    for (let i = 3; i < args.length; i++)
        nombre = nombre + args[i] + ' ';
    nombre = nombre.trim();
    let pl;
    try {
        pl = await existePlaylist(nombre, servidor);
    } catch (e) {}
    if (!pl) {
        console.log('no existe');
        msg.channel.send('No existe esa playlist');
        return false;
    }
    let author = pl.author;
    if ( author != msg.author.id){
        msg.channel.send('Tu no eres el autor de esta playlist');
        return false;
    }
    return true;
}

export { comandosPlaylist }