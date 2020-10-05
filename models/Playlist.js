import { playlistModel } from '../config/database.js'


function borrarPl(nombre, servidor){
    playlistModel.deleteOne( { name:nombre, server:servidor } )
    .then(function(response){
        return response;
    });
}

async function buscarCancion(nomPlaylist, nomCancion, servidor, band = 0){
    let playlistProvider;
    try {
        playlistProvider = playlistModel.findOne({ name: nomPlaylist, server: servidor })
        .then(function(pl){
            return pl;
        }); 
    } catch (e) {}
    let playlist = await playlistProvider;
    
    let i, title;
    let song = null;
    for ( i=0 ; i<playlist.canciones.length ; i++){
        title = band === 0 ? playlist.canciones[i].nombre : playlist.canciones[i].snippet[0].title; 
        if ( title == nomCancion ){
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

async function obtenerPlaylist(servidor){
    let playlistProvider;
    try {
        playlistProvider = playlistModel.find({ server: servidor })
        .then(function(pl){
            return pl;
        }); 
    } catch (e) {}
    let playlists = await playlistProvider;
    return playlists;
}

async function registrarPlaylist(nombre,creador,servidor){
    let playlist = new playlistModel({
        name: nombre,
        author: creador,
        server: servidor
    });    
    await playlist.save();
}

function obtenerCanciones(nombre, servidor){
    let canciones = playlistModel.findOne({ name: nombre, server: servidor })
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

export { registrarPlaylist, existePlaylist, obtenerCanciones, asignarCancion, borrarPl, buscarCancion, removerCancion, obtenerPlaylist }
