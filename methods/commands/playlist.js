import { existePlaylist, registrarPlaylist, asignarCancion, obtenerCanciones } from "../../models/Playlist.js";
import { execute } from "../../config/googleApi.js";
import { playPlaylist } from "./comands.js";

function comandosPlaylist(msg, args) {
    if (!args[2]) {
        msg.channel.send('El comando esta incompleto');
        return;
    }
    let segundoArgumento = args[2];
    switch (segundoArgumento) {
        case 'create':
            crear(msg, args);
            break;
        case 'play':
            reproducirPl(msg, args);
            break;
        case 'delete':
            break;
        default:
            editarPlaylist(msg, args);
    }
}

function crear(msg, args) {
    if (validarCrear(msg, args)) {
        let nombre = '';
        for (let i = 3; i < args.length; i++)
            nombre = nombre + args[i] + ' ';
        nombre = nombre.trim();
        registrarPlaylist(nombre.toLocaleLowerCase());
    }
}

async function editarPlaylist(msg, args) {
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
        song.nombre = cancion;
        asignarCancion(playlist, song);
        return;
    }
    if (msg.content.includes('remove')) {
        
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
        var canciones = await obtenerCanciones(playlist);
    } catch (error) { console.log(error); }

    playPlaylist(canciones,msg);
}

async function validarCrear(msg, args) {
    if (!args[3]) {
        msg.channel.send('Hace falta el nombre de la playlist');
        return false;
    }
    let nombre = '';
    for (let i = 3; i < args.length; i++)
        nombre = nombre + args[i] + ' ';
    nombre.trim();
    let band;
    try {
        band = await existePlaylist(nombre);
    } catch (e) { }
    if (band) {
        msg.channel.send('Ya existe esa playlist');
        return false;
    }
    return true;
}

export { comandosPlaylist }