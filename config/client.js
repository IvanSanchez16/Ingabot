import { Client } from "discord.js";
import { mensajesGeneral } from "../methods/messages.js"
import { comandos } from "../methods/comands.js"

const client = new Client();

client.on('ready', () => {
    //const channel = client.channels.cache.find(channel => channel.name === 'general');
    //channel.send('Ya llegue hijos de la verga');
});

client.on('message',(msg) => {
    if ( !msg.author.bot ){
        if ( msg.channel.name !== 'comandos' ){ //Mensajes general
            mensajesGeneral(msg);
            return;
        }
        comandos(msg); //mensaje canal comandos
    }
});

export { client };
