import google from "googleapis";
import { apiKey } from "./apikey.js";

var gapi = google.google;

function execute(nombre) {
    return gapi.youtube('v3').search.list({
        key: apiKey,
        q: nombre,
        maxResults: 1,
        regionCode: "mx",
        type: [
            "video"
        ],
        part: 'snippet'
    }).then((response) => {
        return response.data.items[0];
    }).catch((err) => console.log(err));
}

export { execute }