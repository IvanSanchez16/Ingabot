const insultos = [
    "Nos vale verga",
    "Quien?",
    "Simon simon ya callate el hocico pues",
    "Chingas a tu madre"
];
var contador = 0;
var puto = null;

var band = false;
var quien = null;

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

export { quien, band, MentadaDeMadre, PutoElUltimo, TePregunto };