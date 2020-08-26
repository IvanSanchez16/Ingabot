import { Client } from "discord.js";
import { 
    Saludo,
    MentadaDeMadre,
    band,
    quien,
    PutoElUltimo,
    TePregunto,
    Pulicuata,
    MensajeSolis
    }
 from "../methods/messages.js"

const client = new Client();

client.on('message',(msg) => {
    if ( !msg.author.bot && msg.channel.name !== 'comandos' ){
        if ( band && msg.author.username === quien){
            TePregunto(msg)
            return;
        }
        if ( msg.content.substr(0, 3) === 'put' && msg.content.length <= 10 && msg.content.length >= 6 ){
            PutoElUltimo(msg);
            return;
        }
        if ( msg.content === 'hola puli' ){
            Saludo(msg);
            return;
        }
        if ( msg.author.username === 'LuiSolis' && Math.floor(Math.random() * 5) == 4){
            MensajeSolis(msg);
            return;
        }
        if ( msg.content.toLocaleLowerCase().includes('pulicuata') ){
            Pulicuata(msg);
            return;
        }
        if ( Math.floor(Math.random() * 10) == 4 ){
            MentadaDeMadre(msg);
            return;
        }
    }
});

export { client };
