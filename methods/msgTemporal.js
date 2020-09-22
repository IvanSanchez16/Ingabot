function mensajeTemporal(msg, texto, duracion=60){
    msg.channel.send(texto)
    .then(function(msgBot){
        setTimeout(() => {
            msgBot.delete();
        }, duracion * 1000);
    });
}

export { mensajeTemporal };