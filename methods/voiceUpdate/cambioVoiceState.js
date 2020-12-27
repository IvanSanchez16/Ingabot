import { Id } from "../../config/client.js";
import { moverBot, desconectarBot } from "../commands/commands.js";

function cambioEstadoVoz(oldState, newState){
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
        decirPuto(puto, newState);
}

function checarPutoElUltimo(oldVoiceState, newVoiceState){
    var fecha = new Date();
    let hora = fecha.getHours();
    var channel = newVoiceState.guild.channels.cache.find(ch => ch.id === newVoiceState.channelID);
    if ( !channel && (hora >= 4 || hora < 17) ) {
        channel = oldVoiceState.guild.channels.cache.find(ch => ch.id === oldVoiceState.channelID);
        let miembros = channel.members.array();
        if ( miembros.length === 2 ){
            let user1 = miembros[0];
            let user2 = miembros[1];
            if ( user1.bot ){
                return user2.user;
            }
            if ( user2.bot ){
                return user1.user;
            }
        }
        if ( miembros.length === 1 ) {
            let puto = miembros[0];
            if ( puto.bot )
                return null;
            return puto.user;
        }
    }
    return null;
}

function decirPuto(puto, newVoiceState){
    let canalGeneral = newVoiceState.guild.channels.cache.find(ch => ch.name === 'general');
    console.log(puto);
    let mensaje;
    switch ( puto.id ) {
        case '140388276715388928':
            mensaje = 'putarra';
            break;
        case '214592973105659906':
            mensaje = 'puteto';
            break;
        case '424388678698401794':
            mensaje = 'putivan';
            break;
        case '422553144749457409':
            mensaje = 'putyñigo';
            break;
        case '371841762307866626':
            mensaje = 'putorbi';
            break;
        case '294632941378863104':
            mensaje = 'putisaac';
            break;
        case '292433171306381313':
            mensaje = 'putonchi';
            break;       
        case '214852268967723008':
            mensaje = 'putaki';
            break;
        default:
            let largo = puto.username.length;
            if (largo <= 4) {
                for(let k = 0 ; k<largo ; k++){
                    let ch = puto.username.toLowerCase().charAt(k);
                    if( ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u' || ch === 'y'){
                        mensaje = `put${puto.username.substring(k,largo)}`
                    }
                }
            }
            for(let i = largo - 4 ; i >= 0 ; i--){
                let c = puto.username.toLowerCase().charAt(i);
                if( c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u' || c === 'y'){
                    mensaje = `put${puto.username.substring(i,largo)}`
                }
            }
    }
    canalGeneral.send(mensaje);
}

export { cambioEstadoVoz };