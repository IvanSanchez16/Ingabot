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

const saludos = [
    'Que rollo',
    'Hola!',
    'Buenas!'
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

var contador = 0;
var puto = null;

var band = false;
var quien = null;

function Saludo(msg){
    let number = Math.floor(Math.random() * saludos.length);
    msg.channel.send( saludos[number] );
}

function MentadaDeMadre(msg) {
    let number = Math.floor(Math.random() * insultos.length);
    if( number === 1 ){
        band = true;
        quien = msg.author.username;
    }
    msg.channel.send(insultos[ number ]);
}

function TePregunto(msg){
    band = false;
    quien = null;
    msg.channel.send("Te pregunto");
}

function PutoElUltimo(msg){
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

function Pulicuata(msg){
    let number = Math.floor(Math.random() * respPulicuata.length);
    msg.channel.send( respPulicuata[number] );
}

function MensajeSolis(msg){
    let number = Math.floor(Math.random() * respSolis.length);
    msg.channel.send( respSolis[number] );
}

export { quien, band, MentadaDeMadre, PutoElUltimo, TePregunto, Pulicuata, MensajeSolis, Saludo };