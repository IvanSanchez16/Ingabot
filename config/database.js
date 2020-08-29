import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/pulibot', {useNewUrlParser: true});

var playlistSchemaJSON = {
    name:String,
    author:String,
    canciones:Array
};

var cancionesSchemaJSON = {
    name:String,
    link:String
};

var playlist_schema = new mongoose.Schema(playlistSchemaJSON);

var cancion_schema = new mongoose.Schema(cancionesSchemaJSON);

var cancionModel = mongoose.model('canciones', cancion_schema);

var playlistModel = mongoose.model('playlists', playlist_schema);

function borrarCancion(nombre){
    let numBorrados = cancionModel.deleteOne({ name: nombre })
    .then(function(value){
        return value;
    });
    return numBorrados;
}

function cancionesDisponibles(){
    let canciones = cancionModel.find({}, null, { sort: {name: 1} });
    return canciones;
}

function obtenerCancion(nombre){
    let enlace = cancionModel.findOne({ name: nombre })
    .then(function(cancion){
        return !cancion ? null : cancion.link;
    });
    return enlace;
}

function obtenerCancionxEnlace(enlaceVideo){
    let nombre = cancionModel.findOne({ link: enlaceVideo })
    .then(function(cancion){
        return cancion.name;
    });
    return nombre;
}

async function registrarCancion(nombre, enlace){
    try {
        var band = await obtenerCancionxEnlace(enlace);
    } catch(e) {
        console.log(e);
    }
    if ( band )
        return false;
        
    let cancion = new cancionModel({
        name: nombre,
        link: enlace
    });
    await cancion.save();
    return true;
}

export { registrarCancion, obtenerCancion, cancionesDisponibles, borrarCancion };