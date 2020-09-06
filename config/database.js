import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/pulibot', {useNewUrlParser: true});

var cancionesSchemaJSON = {
    name:String,
    link:String
};

var playlistSchemaJSON = {
    name: String,
    author: String,
    canciones: [ { id: Array, snippet: Array } ]
};

var playlist_schema = new mongoose.Schema(playlistSchemaJSON);

var cancion_schema = new mongoose.Schema(cancionesSchemaJSON);

var cancionModel = mongoose.model('canciones', cancion_schema);

var playlistModel = mongoose.model('playlists', playlist_schema);

export { cancionModel, playlistModel };