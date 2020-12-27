import { Id } from "../../config/client.js";
import { moverBot, desconectarBot } from "../commands/commands.js";

function cambioEstadoVoz(oldState, newState){
    var canal = newState.guild.channels.cache.find(ch => ch.id === newState.channelID);
    console.log(canal.members.array());
    //Pulibot
    if ( newState.id === Id ){
        if ( newState.connection && typeof oldState.channelID !== 'undefined' ){
            var channel = newState.guild.channels.cache.find(ch => ch.id === newState.channelID);
            moverBot( channel );
            return;
        }
        if ( !newState.channelID ){
            desconectarBot( newState );
            return;
        }
    }
    
    let puto = checarPutoElUltimo(oldState, newState);
    if ( puto )
        decirPuto(puto);
}

function checarPutoElUltimo(oldVoiceState, newVoiceState){
    var fecha = new Date();
    let hora = fecha.getHours();
    console.log(hora);
    var channel = newVoiceState.guild.channels.cache.find(ch => ch.id === newVoiceState.channelID);
    if ( !channel && (hora >= 21 || hora < 9) ) {
        channel = oldVoiceState.guild.channels.cache.find(ch => ch.id === oldVoiceState.channelID);
        let miembros = channel.members.array();
        if ( miembros.length === 1 ) {
            let puto = miembros[0];
            puto = puto.user;
            return puto;
        }
    }
    return null;
}

function decirPuto(puto){
    console.log(puto);
    switch ( puto.id ) {

    }
}

export { cambioEstadoVoz };