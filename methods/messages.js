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
    if ( isComando(msg.content) ){ //Pones algun comando
        comando(msg);
        return;
    }
    if ( msg.content.toLocaleLowerCase() === 'quien' || msg.content.toLocaleLowerCase() === 'quien?'){ //Pone alguien quien
        quien(msg);
        return;
    }
    if ( band && msg.author.username === quien){ //Despues del Quien?
        tePregunto(msg)
        return;
    }
    if ( msg.content.substr(0, 3) === 'put' && msg.content.length <= 10 && msg.content.length >= 6 ){ //Cuando se dice putifica el nombre de alguien
        putoElUltimo(msg);
        return;
    }
    if ( msg.content === 'hola puli' ){ //Saludo al bot
        saludo(msg);
        return;
    }
    if ( msg.content.toLocaleLowerCase().includes('pulicuata') ){ //Cuando mencionan la pulicuata
        pulicuata(msg);
        return;
    }
    if ( msg.author.username === 'LuiSolis' && Math.floor(Math.random() * 8) == 4){ //Mensaje de Luissb_32
        mensajeSolis(msg);
        return;
    }
    if ( Math.floor(Math.random() * 15) == 4 ){ //Cualquier mensaje
        mentadaDeMadre(msg);
        return;
    }
}

function comando(msg){
    msg.delete();
    msg.channel.send('No pongas comandos aqui hijo de la verga');
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

function putoElUltimo(msg){
    if ( puto === null ){
        puto = msg.content;
        contador++;
        return;
    }
    if ( msg.content === puto ){
        contador++;
    }else{
        contador=0;
        puto = null;
    }
    if ( contador >= 2 ){
        msg.channel.send(puto);
        contador=0;
        puto = null;
    }
}

function quien(msg){
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

export { mensajesGeneral };