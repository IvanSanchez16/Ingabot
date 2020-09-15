import { playlistModel } from '../config/database.js'


function borrarPl(nombre, servidor){
    playlistModel.deleteOne( { name:nombre, server:servidor } )
    .then(function(response){
        return response;
    });
}

async function buscarCancion(nomPlaylist, nomCancion, servidor){
    let playlistProvider;
    try {
        playlistProvider = playlistModel.findOne({ name: nomPlaylist, server: servidor })
        .then(function(pl){
            return pl;
        }); 
    } catch (e) {}
    let playlist = await playlistProvider;
    
    let i;
    let song = null;
    for ( i=0 ; i<playlist.canciones.length ; i++){
        if ( playlist.canciones[i].nombre == nomCancion ){
            song = playlist.canciones[i];
            song.index = i;
            break;
        }
    }
    return song;
}

async function existePlaylist(nombre, servidor){
    let playlistProvider;
    try {
        playlistProvider = playlistModel.findOne({ name: nombre, server: servidor })
        .then(function(pl){
            return pl;
        }); 
    } catch (e) {}
    let playlist = await playlistProvider;
    return playlist;
}

async function registrarPlaylist(nombre,creador,servidor){
    let playlist = new playlistModel({
        name: nombre,
        author: creador,
        server: servidor
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

async function asignarCancion(nomPlaylist, cancion, servidor){
    let playlistProvider;
    try {
        playlistProvider = playlistModel.findOne({ name: nomPlaylist, server: servidor })
        .then(function(pl){
            return pl;
        }); 
    } catch (e) {}
    let playlist = await playlistProvider;
    playlist.canciones.push(cancion);
    await playlist.save();
}

async function removerCancion(nomPlaylist, servidor, index){
    let playlistProvider;
    try {
        playlistProvider = playlistModel.findOne({ name: nomPlaylist, server: servidor })
        .then(function(pl){
            return pl;
        }); 
    } catch (e) {}
    let playlist = await playlistProvider;
    playlist.canciones.splice(index, 1);
    await playlist.save();
}

export { registrarPlaylist, existePlaylist, obtenerCanciones, asignarCancion, borrarPl, buscarCancion, removerCancion }
