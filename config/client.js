import { Client } from "discord.js";
import { mensajesGeneral } from "../methods/messages.js"
import { comandos } from "../methods/commands/comands.js"

const client = new Client();

client.on('ready', () => {
    console.log('Listo');
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
