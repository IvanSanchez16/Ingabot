import { client } from './config/client.js';
import { token } from "./config/token.js";

client.on('ready', () => {
    console.log('Bot is now conected');
});

client.login(token);