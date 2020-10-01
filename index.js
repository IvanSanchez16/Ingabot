import { client } from './config/client.js';
import { token } from "./config/token.js";

client.login(process.env.token);