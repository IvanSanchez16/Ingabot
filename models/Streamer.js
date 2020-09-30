import { streamerModel } from "../config/database.js";

async function registrarStreamer( streamer ){
    let s = new streamerModel( streamer );
    await s.save();
}

async function getStreamers(){
    let streamersProvider = streamerModel.find()
    .then(function(s){
        return s;
    });
    return await streamersProvider;
}

async function actualizarEstado(nombre){
    let streamerProvider;
    try {
        streamerProvider = streamerModel.findOne({ name: nombre })
        .then(function(s){
            return s;
        }); 
    } catch (e) {}
    let streamer = await streamerProvider;
    streamer.islive = !streamer.islive;
    await streamer.save();
}

export { getStreamers, registrarStreamer, actualizarEstado }