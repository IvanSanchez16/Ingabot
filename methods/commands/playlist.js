import ytdl from "ytdl-core"
import { obtenerPlaylist,existePlaylist, registrarPlaylist, asignarCancion, obtenerCanciones, borrarPl, buscarCancion, removerCancion } from "../../models/Playlist.js";
import { execute } from "../../config/googleApi.js";
import { playPlaylist, detallesCancion } from "./commands.js";
import Discord from "discord.js"


var expReg = new RegExp('^[A-Za-z0-9/-\sáíóúéñ]*$');

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
            reproducirPl(msg, args, servidor);
            break;
        case 'delete':
            borrarPlaylist(msg, args, servidor);
            break;
        case 'list':
            listaPlaylist(msg, servidor);
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
        msg.channel.send(`la playlist ${nombre} ha sido creada`);
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
        for (let k = i; k < args.length; k++){
            if ( !expReg.test(args[k]) ){
                msg.channel.send("No te pases de verga que es esa madre");
                return false;
            }
            cancion = cancion + args[k] + ' ';
        }
        cancion = cancion.trim();
        try {
            var song = await execute(cancion);
        } catch (error) { console.log(error) }
        song.nombre = cancion;
        song.author = msg.author;
        let id = song.id;
        let canal = song.snippet.channelTitle;
        canal = quitarEspacios(canal);
        let link = 'https://www.youtube.com/watch?v=' + id.videoId + '&ab_channel=' + canal;
        await ytdl.getBasicInfo(link, { filter: "audioonly", quality: "highestaudio" }).then((value) => {
            song.duracion = value.player_response.videoDetails.lengthSeconds;
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
            song.volumen = fx;
        });
        song.link = link;

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
        for (let k = i; k < args.length; k++){
            if ( !expReg.test(args[k]) ){
                msg.channel.send("No te pases de verga que es esa madre");
                return false;
            }
            cancion = cancion + args[k] + ' ';
        }
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

async function listaPlaylist(msg, servidor){
    let playlists;
    try{
        playlists = await obtenerPlaylist(servidor);
    }catch(e){}
    var embed = new Discord.MessageEmbed();
    var listaPlaylists = [];
    var listapl;
    var autor;
    embed.setTitle("Lista de playlists");
    embed.setColor([33, 180, 69 ]);
    let cont, minDuracion, segDuracion, duracion, contArreglo, hrsDuracion;
    let band3;
    var segPlaylist;
    playlists.forEach(pl => {
        hrsDuracion = 0;
        segPlaylist = 0;
        contArreglo = 0;
        if ( pl.name !== pl.author ){
            band3 = true;
            cont = 1;
            listapl = "";
            autor = msg.guild.members.cache.find(m => m.id === pl.author);
            try {
                listapl = `Autor: ${autor.user.username}\nCanciones:\n`;
            } catch (error) {
                listapl = `Autor: Desconocido\nCanciones:\n`;
            }
            pl.canciones.forEach(cancion => {
                segPlaylist += parseInt(cancion.duracion, 10);
                let snippet = cancion.snippet;
                snippet = snippet[0];
                minDuracion = Math.trunc(cancion.duracion / 60);
                segDuracion = cancion.duracion % 60;
                if(segDuracion < 10)
                    segDuracion = '0'+segDuracion;
                duracion = `${minDuracion}:${segDuracion}`;
                let aux = `${cont++}-. ${snippet.title} (${duracion})\n`;
                if( listapl.length + aux.length > 1024 ){
                    let plfield = {
                        name: band3 ? pl.name : "-",
                        value: listapl
                    };
                    listaPlaylists.push(plfield);
                    if ( band3 )
                        contArreglo = listaPlaylists.length - 1;

                    band3 = false;
                    listapl = aux;
                }else
                    listapl = listapl + aux;
            });
            let plfield = {
                name: band3 ? pl.name : "-",
                value: listapl
            };
            listaPlaylists.push(plfield);

            let primerElemento = band3 ? listaPlaylists[ listaPlaylists.length - 1 ] : listaPlaylists[contArreglo];
            minDuracion = Math.trunc(segPlaylist / 60);
            if ( minDuracion >= 60 ){
                hrsDuracion = Math.trunc(minDuracion / 60);
                minDuracion = minDuracion % 60;
            }
            primerElemento.name += (hrsDuracion == 0 ? ` (${minDuracion} min)` : ` (${hrsDuracion} hr ${minDuracion} min)`);
        }
    });
    embed.addFields(listaPlaylists);
    msg.channel.send(embed);
}

function quitarEspacios(canal){
    let arreglo = canal.split(' ');
    let newCanal = '';
    arreglo.forEach(elemento => {
        newCanal = newCanal + elemento;
    });
    return newCanal;
}

async function registrarRecord(cancion,author, servidor){
    let band;
    try {
        band = await existePlaylist(author, servidor);
    } catch (e) {}
    if( !band ) //No existe
        registrarPlaylist(author,author,servidor);
        
    setTimeout(async() => {
        let band2;
        try{
            band2 = await buscarCancion(author,cancion.snippet.title,servidor,1);
        }catch(e){}
        if ( !band2 ) 
            asignarCancion(author, cancion, servidor); 
    }, 2000 );
}

async function reproducirRecord(msg, args){
    let band;
    let servidor = msg.guild.id;
    try{
        band = await validarReproducir(msg, args, servidor);
    }catch(e){}
    if ( band ){
        try {
            var canciones = await obtenerCanciones( msg.author.id, servidor );
        } catch (error) { console.log(error); }
        playPlaylist(canciones,msg);
    }
}

async function reproducirPl(msg, args, servidor) {
    let playlist = '';
    let i;
    for (i = 3; i < args.length ; i++)
        playlist = playlist + args[i] + ' ';
    playlist = playlist.trim();

    let band;
    try {
        band = await existePlaylist(playlist.toLocaleLowerCase(), servidor);
    } catch (e) {}
    if (!band) {
        msg.channel.send('No existe esa playlist we');
        return;
    }

    try {
        var canciones = await obtenerCanciones( playlist.toLocaleLowerCase(), servidor );
    } catch (error) { console.log(error); }

    playPlaylist(canciones,msg);
}

async function validarCrear(msg, args, servidor) {
    if (!args[3]) {
        msg.channel.send('Todo eso? te faltó el nombre');
        return false;
    }
    let nombre = '';
    for (let i = 3; i < args.length; i++){
        if ( !expReg.test(args[i]) ){
            msg.channel.send("No te pases de verga que es esa madre, ponga un nombre bien");
            return false;
        }
        nombre = nombre + args[i] + ' ';
    }
    nombre = nombre.trim();
    let band;
    try {
        band = await existePlaylist(nombre, servidor);
    } catch (e) {}
    if (band) {
        msg.channel.send('Te ganaron el nombre chiquito');
        return false;
    }
    return true;
}

async function validarBorrar(msg, args, servidor){
    if (!args[3]) {
        msg.channel.send('Todo eso? te faltó la playlist');
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
        msg.channel.send('La borré antes de que lo pidieras, no existía crack');
        return false;
    }
    let author = pl.author;
    if ( author != msg.author.id){
        msg.channel.send('Ahí vas de mamón a meterte en lo que no es tuyo, no puedes borrar playlist que no son tuyas');
        return false;
    }
    return true;
}

async function validarReproducir(msg, args, servidor){
    if ( args[2] !== 'record'){
        msg.channel.send('Probablemente quisite decir record, o me equivoco puto imbecil?');
        return false;
    }
    let band;
    try {
        band = await existePlaylist(msg.author.id, servidor);
    } catch (e) {}
    if (!band) {
        msg.channel.send('Primero reproduce canciones para generar record, no tengo tu spotify pendejo');
        return false;
    }
    return true;
}

export { comandosPlaylist, registrarRecord, reproducirRecord }