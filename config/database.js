import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/pulibot', {useNewUrlParser: true});

var playlistSchemaJSON = {
    name: String,
    author: Number,
    server: Number,
    canciones: [ { id: Array, snippet: Array, nombre: String  } ]
};

var streamerSchemaJSON = {
    name: String,
    channel: String,
    islive: Boolean
};

var playlist_schema = new mongoose.Schema(playlistSchemaJSON);

var streamer_schema = new mongoose.Schema(streamerSchemaJSON);

var streamerModel = mongoose.model('streamer', streamer_schema);

var playlistModel = mongoose.model('playlists', playlist_schema);

export { streamerModel, playlistModel };