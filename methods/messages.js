const insultos = [
    "Nos vale verga",
    "Quien?",
    "Simon simon ya callate el hocico pues"
];

function MentadaDeMadre(msg) {
    msg.channel.send(insultos[ Math.floor(Math.random() * insultos.length) ]);
}

function PutoElUltimo(msg){
    msg.channel.send(msg.content);
}

export { MentadaDeMadre, PutoElUltimo };