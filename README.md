Pulibot

Instalacion
    -. Dentro de la carpeta config crear el archivo token.js con la siguiente estructura:
        
            const token = "TOKEN_DE_DISCORD";

            export { token };
        
        
        Para poder utilizar el bot a desear
    
    -. Dentro de la misma carpeta crear el archivo apikey.js con la siguiente estructura:

        const apiKey = "TOKEN_GOOGLE";

        export { apiKey };

        Esto es para consumir api de youtube y obtener los url con poner un nombre

    -. Ejecutar el comando 'npm install'

    -. Es necesario instalar de manera correcta FFMPEG
      Seguir el siguiente tutorial: https://www.youtube.com/watch?v=qjtmgCb8NcE

Despertar el bot
    -. Para correr el bot correr 'node index.js'