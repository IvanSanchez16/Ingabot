const listaDeComandos = [
    {
        name: 'p {enlace de youtube}',
        value: 'Reproducir canción',
    },
    {
        name: 'p {enlace de youtube} {nombre cancion}',
        value: 'Reproduce una cancion y la registra con el nombre del 3er parametro'
    },
    {
        name: 'p {nombre cancion}',
        value: 'Reproduce una cancion registrada previamente'
    },
    {
        name: 'skip',
        value: 'Saltar una canción'
    }
];

export { listaDeComandos };