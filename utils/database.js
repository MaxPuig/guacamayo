import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
const db = new Low(new JSONFile('./data/database.json'));


await db.read();
if (db.data === null) { // Si no existe el archivo/db, lo crea.
    db.data = {
        'nombresAudio': {},
        'freeGames': [],
        'tempGames': {},
        'rss': [],
        'adminPerms': {},
        'activities': {}
    }
    await db.write();
} else { // Si existe, comprueba que no falten campos.
    db.data.nombresAudio = db.data.nombresAudio || {};
    db.data.freeGames = db.data.freeGames || [];
    db.data.tempGames = db.data.tempGames || {};
    db.data.rss = db.data.rss || [];
    db.data.adminPerms = db.data.adminPerms || {};
    db.data.activities = db.data.activities || {};
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