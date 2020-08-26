import { Client } from "discord.js";
import { 
    MentadaDeMadre,
    PutoElUltimo
    } from "../methods/messages.js"

const client = new Client();

client.on('message',(msg) => {
    if ( !msg.author.bot ){
        if ( msg.content.substr(0, 3) === 'put' && msg.content.length <= 10){
            PutoElUltimo(msg);
            return;
        }
        if ( msg.channel.name !== 'musica' && Math.floor(Math.random() * 10) == 4 ){
            MentadaDeMadre(msg);
            return;
        }
    }
});

export { client };
