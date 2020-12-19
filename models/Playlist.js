import { playlistModel } from '../config/database.js'
import ytdl from "ytdl-core"


async function arreglarplaylists(msg){
    let playlistProvider;
    try {
        playlistProvider = playlistModel.find({})
        .then(function(pl){
            return pl;
        }); 
    } catch (e) {}
    let playlists = await playlistProvider;
    let canciones, cancionNueva;
    for(var playlist of playlists) {  
        canciones = playlist.canciones;
        for(var cancion of canciones) {
            if( !cancion.link ){
                console.log(cancion.nombre);
                try {
                    cancionNueva = repararCancion(cancion)
                    .then(function(c){
                        return c;
                    });
                } catch (error) {}
                cancion = await cancionNueva;
                console.log(cancion.nombre);
            }
        }
        await playlist.save();
    }
}

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

async function repararCancion(cancion){
    let PromiseCancion = new Promise( async(resolve, reject) => {
        let id, canal, link;
        id = cancion.id;
        id = id[0];
        canal = cancion.snippet[0].channelTitle;
        canal = quitarEspacios(canal);
        link = 'https://www.youtube.com/watch?v=' + id.videoId + '&ab_channel=' + canal;
        await ytdl.getBasicInfo(link, { filter: "audioonly", quality: "highestaudio" }).then((value) => {
            cancion.duracion = value.player_response.videoDetails.lengthSeconds;
            let loudness;
            if(!value.player_response.playerConfig){
                loudness = 4;
            } else {
                loudness = value.player_response.playerConfig.audioConfig.loudnessDb;
                if(!loudness)
                    loudness = 4;    
            }
            let fx = (loudness - 23) * (-8 / 74);
            fx = Math.log(fx) / 1.04;
            cancion.volumen = fx;
        });
        cancion.link = link;
        resolve(cancion);
    });
    return PromiseCancion;
}

function quitarEspacios(canal){
    let arreglo = canal.split(' ');
    let newCanal = '';
    arreglo.forEach(elemento => {
        newCanal = newCanal + elemento;
    });
    return newCanal;
}

export { arreglarplaylists, registrarPlaylist, existePlaylist, obtenerCanciones, asignarCancion, borrarPl, buscarCancion, removerCancion, obtenerPlaylist }
