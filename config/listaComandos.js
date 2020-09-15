const listaDeComandos = [
    {
        name: 'p {nombre de la cancion}',
        value: 'Reproducir canción',
    },
    {
        name: 'cs',
        value: 'Indica cual es la cancion en reproduccion actualmente'
    },
    {
        name: 'skip',
        value: 'Saltar una canción'
    },
    {
        name: 'queue',
        value: 'Muestra la cola de reproduccion'
    },
    {
        name: 'pl create {nombre playlist}',
        value: 'Crea una nueva playlist'
    },
    {
        name: 'pl delete {nombre playlist}',
        value: 'Borrar una playlist, solo el autor puede hacerlo'
    },
    {
        name: 'pl play {nombre playlist}',
        value: 'Reproduce una playlist'
    },
    {
        name: 'pl {nombre playlist} add {nombre de la cancion}',
        value: 'Agrega una canción a la playlist'
    },
    {
        name: 'pl {nombre playlist} remove {nombre de la cancion}',
        value: 'Elimina una cancion de la playlist'
    }
];

export { listaDeComandos };