import { Client } from "discord.js";
import { mensajesGeneral } from "../methods/messages.js"
import { comandos } from "../methods/commands/commands.js"
import { comandosCine } from "../methods/commands/cine.js";

const client = new Client();

client.on('ready', () => {
    console.log('Listo');
});

client.on('message',(msg) => {
    if ( !msg.author.bot ){
        if ( msg.channel.name === 'comandos' ){ //Comandos
            comandos(msg);
            return;
        }
        if ( msg.channel.name === 'chat-cine' ){ //Cinefilo mamador
            comandosCine(msg);
            return;
        }
         //Mensaje general
         mensajesGeneral(msg);
    }
});

client.on('guildMemberAdd', member => {
    var channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    var role = member.guild.roles.cache.find(role => role.name === 'Ingainvitados');
    member.roles.add(role);
    channel.send(`Llegó ${member} ya vamonos`);
  });

export { client };
