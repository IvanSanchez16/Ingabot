import fs from "fs";

function cambioEstadoVoz(oldState, newState){
    var channel = newState.guild.channels.cache.find(ch => ch.id === newState.channelID);
    if ( channel && !newState.serverMute && !newState.selfMute && newState.connection != null){
        var userConnection = newState.connection;
        console.log(userConnection);
    }
    if ( checarPutoElUltimo(oldState, newState) ){

    }
}

function checarPutoElUltimo(oldVoiceState, newVoiceState){
    var channel = newVoiceState.guild.channels.cache.find(ch => ch.id === newVoiceState.channelID);
    if ( !channel ){
        channel = oldVoiceState.guild.channels.cache.find(ch => ch.id === oldVoiceState.channelID);
        let miembros = channel.members.array();
        if ( miembros.length === 1 ){
            
        }
    }
}

export { cambioEstadoVoz };