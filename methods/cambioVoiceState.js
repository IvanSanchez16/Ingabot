import fs from "fs";
import { Id } from "../config/client.js";
import { moverBot, desconectarBot } from "./commands/commands.js";

function cambioEstadoVoz(oldState, newState){
    //Pulibot
    if ( newState.id === Id){
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
    /*
    var channel = newState.guild.channels.cache.find(ch => ch.id === newState.channelID);
    if ( channel && !newState.serverMute && !newState.selfMute && newState.connection != null){
        var userConnection = newState.connection;
        console.log(userConnection);
    }
    if ( checarPutoElUltimo(oldState, newState) ){

    }
    */
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