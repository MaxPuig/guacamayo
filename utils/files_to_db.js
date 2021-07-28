import { setDatabase, getDatabase } from './database.js';


let datos = await getDatabase('nombresAudio')

for (const [key, value] of Object.entries(datos)) {
    datos[key] = value;
    datos[key].disabled = false;
    datos[key].delante_o_detras = "detras";
    datos[key].frase = "Se ha unido";
    datos[key].idioma = "es-es";
    datos[key].genero = "chico";
}

setDatabase('nombresAudio', datos);
console.log("Changes applied to db");


/*
import { readFileSync } from 'fs';
let a1 = JSON.parse(readFileSync('./data/rss.json', 'utf-8'));
setDatabase('rss', a1);
let a2 = JSON.parse(readFileSync('./data/channels.json', 'utf-8'));
setDatabase('channelsRelay', a2);
let a3 = JSON.parse(readFileSync('./data/customPrefix.json', 'utf-8'));
setDatabase('customPrefix', a3);
let a4 = JSON.parse(readFileSync('./data/freeGames.json', 'utf-8'));
setDatabase('freeGames', a4);
let a5 = JSON.parse(readFileSync('./data/nombresAudio.json', 'utf-8'));
setDatabase('nombresAudio', a5);
let a6 = JSON.parse(readFileSync('./data/lists.json', 'utf-8'));
setDatabase('lists', a6);

console.log("Files migrated to db");
*/