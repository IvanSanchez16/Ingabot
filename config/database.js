import mongoose from 'mongoose'

var pass = process.env.password;

mongoose.connect(`mongodb+srv://pulibotheroku:${pass}@clusterbot.b8sfd.mongodb.net/pulibot?retryWrites=true&w=majority`, {useNewUrlParser: true});

var playlistSchemaJSON = {
    name: String,
    author: String,
    server: String,
    canciones: [{ 
        id: Array,
        snippet: Array,
        nombre: String,
        link:String,
        duracion:String,
        volumen:Number 
    }]
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