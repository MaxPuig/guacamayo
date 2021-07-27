import { setDatabase } from './database.js';
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

console.log("Files migrated to db")