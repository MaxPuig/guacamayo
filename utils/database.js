import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const defaultData = {
    nombresAudio: {},
    freeGames: [],
    tempGames: {},
    rss: [],
    adminPerms: {},
    activities: {},
};

const db = new Low(new JSONFile("./data/database.json"), defaultData);

await db.read();
// Comprueba que no falten campos
db.data = { ...defaultData, ...db.data };
await db.write();

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
