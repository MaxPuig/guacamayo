import { Low, JSONFile } from 'lowdb';
const db = new Low(new JSONFile('./data/database.json'));


await db.read();
if (db.data === null) { // Si no existe el archivo/db, lo crea.
    db.data = {
        'channelsRelay': {},
        'customPrefix': {},
        'nombresAudio': {},
        'freeGames': [],
        'rss': [],
        'lists': {}
    }
    await db.write();
}


/** Devuelve el objeto o array. */
async function getDatabase(part) {
    await db.read();
    return db.data[part];
}


/** Guarda el objeto o array. */
async function setDatabase(part, value) {
    db.data[part] = value;
    await db.write();
}


export { getDatabase, setDatabase };