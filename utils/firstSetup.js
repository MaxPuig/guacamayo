import { readFileSync, writeFileSync, mkdirSync } from 'fs';


/** Crea todos los archivos necesarios. Solo se ejecuta 1 vez si no existe el archivo "./data/setup.done"*/
function first_execution() {
    try {
        readFileSync('./data/setup.done', 'utf-8');
    } catch {
        create_folders_and_files()
    }
}


/** Crea los archivos y carpetas. Al finalizar crea "./data/setup.done" */
function create_folders_and_files() {
    mkdirSync('./data/audioNombres', { recursive: true });
    const start = {};
    const start2 = [];
    writeFileSync('./data/lists.json', JSON.stringify(start));
    writeFileSync('./data/nombresAudio.json', JSON.stringify(start));
    writeFileSync('./data/customPrefix.json', JSON.stringify(start));
    writeFileSync('./data/channels.json', JSON.stringify(start));
    writeFileSync('./data/rss.json', JSON.stringify(start2));
    writeFileSync('./data/freeGames.json', JSON.stringify(start2));
    writeFileSync('./data/setup.done', JSON.stringify(start));
    console.log("First setup done. Files and folders have been created.")
}


export { first_execution };