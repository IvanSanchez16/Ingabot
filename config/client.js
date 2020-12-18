import { Client } from "discord.js";
import { mensajesGeneral } from "../methods/messages.js"
import { comandos } from "../methods/commands/commands.js"
import { comandosCine } from "../methods/commands/cine.js";
import { cambioEstadoVoz } from "../methods/cambioVoiceState.js";
import { comandosCubiculo } from "../methods/commands/cubiculo.js";
import { streamAlert } from "../methods/streamAlert.js";

const client = new Client({disableEveryone: false});
const Id = '747931336538587206';

client.on('ready', () => {
    console.log('Listo');
    streamAlert();
});

client.on('message',(msg) => {
    if ( !msg.author.bot ){
        if ( msg.channel.name === 'comandos' || msg.channel.name === 'ayuda'){ //Comandos
            comandos(msg);
            return;
        }
        if ( msg.channel.name === 'chat-cine' ){ //Cinefilo mamador
            comandosCine(msg);
            return;
        }
        if ( msg.channel.name === 'chat-tareas' ){ //Estudios
            comandosCubiculo(msg);
            return;
        }
        if( msg.channel.name === 'cartelera'){ //Cartelera cine
                
            return;
        }
        if( msg.channel.name !== 'sugerencias'){
            //Mensaje en Ingacanales de cotorreo
            mensajesGeneral(msg);   
            return;
        }
    }
});

client.on('guildMemberAdd', member => {
    var saludos = [
        `Llegó ${member} ya vamonos`,
        `Pinche ${member} como vale verga... oh que rollo we`,
        `Denle la bienvenida a ${member}`
    ];
    
    var channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    var role = member.guild.roles.cache.find(role => role.name === 'Ingainvitados');
    member.roles.add(role);
    let num = Math.floor(Math.random() * saludos.length);
    channel.send(saludos[num]);
});

client.on('voiceStateUpdate',(oldState, newState) => {
    cambioEstadoVoz(oldState, newState);
})

export { client, Id };
