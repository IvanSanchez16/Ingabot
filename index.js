import { client } from './config/client.js';
import { token } from "./config/token.js";

client.on('ready', () => {
    const channel = client.channels.cache.find(channel => channel.name === 'general');
    channel.send('Ya llegue hijos de la verga');
});

client.login(token);