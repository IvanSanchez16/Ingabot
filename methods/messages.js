import { mensajeTemporal } from "./msgTemporal.js";

const insultos = [
    "Nos vale verga",
    "Quien?",
    "Simon simon ya callate el hocico pues",
    "Chingas a tu madre"
];

const respPulicuata = [
    'Puras mamadas decia el fifo',
    'Es mentira esa madre',
    'Pinche fifo'
];

const respSolis = [
    "Te quiero Solis",
    'Pinche cerda de mierda',
    'Pinche foca celulitica',
    'Ya me cambiaste por el pendejo del Canelitas',
    'Te gustan de rancho',
    'Chinga tu madre gordo de mierda',
    '* Zape *'
];

const saludos = [
    'Que rollo',
    'Hola!',
    'Buenas!'
];

var contador = 0;
var puto = null;

var band = false;
var quien = null;

function mensajesGeneral(msg){
    if ( !comprobarMultimedia(msg) )
            return;
    if ( isComando(msg.content) ){ //Pones algun comando
        comando(msg,true);
        return;
    }
    if ( msg.content.toLocaleLowerCase() === 'quien' || msg.content.toLocaleLowerCase() === 'quien?'){ //Pone alguien quien
        respQuien(msg);
        return;
    }
    if ( band && msg.author.username === quien){ //Despues del Quien?
        tePregunto(msg)
        return;
    }
    if ( msg.content.toLocaleLowerCase() === 'hola puli' ){ //Saludo al bot
        saludo(msg);
        return;
    }
    if ( msg.content.toLocaleLowerCase().includes('pulicuata') ){ //Cuando mencionan la pulicuata
        pulicuata(msg);
        return;
    }
    if ( msg.author.username === 'LuiSolis' && Math.floor(Math.random() * 25) == 4){ //Mensaje de Luissb_32
        mensajeSolis(msg);
        return;
    }
    if ( Math.floor(Math.random() * 30) == 4 ){ //Cualquier mensaje
        mentadaDeMadre(msg);
        return;
    }
}

function comando(msg,band){
    msg.delete();
    let texto = band ? 'No pongas comandos aqui hijo de la verga' : 'No se si sabes leer, pero este canal es de comandos';
    mensajeTemporal(msg, texto+' <@'+msg.author.id+">");
}

function comprobarMultimedia(msg){
    let texto;
    let arryTemp = msg.attachments.first(1);
    if( msg.channel.name !== 'multimedia' && arryTemp.length > 0){
        msg.delete();
        texto = 'Hay un orden aquí cabron, tus chingaderas en multimedia....por favor';
        mensajeTemporal(msg, texto+' <@'+msg.author.id+">");
        return false;
    }
    return true;
}

function isComando(msg){
    let inicio = msg.startsWith('-') || msg.startsWith('!') || msg.startsWith('/');
    let charCode = msg.charCodeAt(1);
    return inicio && ( (charCode >= 65 && charCode<=90) || (charCode >= 97 && charCode<=122) );
}

function mensajeSolis(msg){
    let number = Math.floor(Math.random() * respSolis.length);
    msg.channel.send( respSolis[number] );
} 

function mentadaDeMadre(msg) {
    let number = Math.floor(Math.random() * insultos.length);
    if( number === 1 ){
        band = true;
        quien = msg.author.username;
    }
    msg.channel.send(insultos[ number ]);
}

function pulicuata(msg){
    let number = Math.floor(Math.random() * respPulicuata.length);
    msg.channel.send( respPulicuata[number] );
}

function respQuien(msg){
    msg.channel.send('Te pregunto');
}

function saludo(msg){
    let number = Math.floor(Math.random() * saludos.length);
    msg.channel.send( saludos[number] );
}

function tePregunto(msg){
    band = false;
    quien = null;
    msg.channel.send("Te pregunto");
}

export { mensajesGeneral, isComando, comando };