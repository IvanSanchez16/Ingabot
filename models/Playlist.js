import { playlistModel } from '../config/database.js'

async function existePlaylist(nombre){
    let enlace = await playlistModel.findOne({ name: nombre })
    .then(function(playlist){
        return !playlist ? null : playlist.name;
    });
    return enlace;
}

async function registrarPlaylist(nombre){
    let playlist = new playlistModel({
        name: nombre
    });    
    await playlist.save();
}

function obtenerCanciones(nombre){
    let canciones = playlistModel.findOne({ name: nombre })
    .then(function(playlist){
        return playlist.canciones;
    });
    return canciones;
}

async function asignarCancion(nomPlaylist,nombre,enlace){
    let playlistProvider;
    try {
        playlistProvider = playlistModel.findOne({ name: nomPlaylist })
        .then(function(pl){
            return pl;
        }); 
    } catch (e) {}
    playlist = await playlistProvider;
    playlist.canciones.push({
        name: nombre,
        link: enlace
    });
    await playlist.save();
}

export { registrarPlaylist, existePlaylist, obtenerCanciones, asignarCancion }
