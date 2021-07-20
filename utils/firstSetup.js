const fs = require('fs');


/** Crea todos los archivos necesarios. Solo se ejecuta 1 vez si no existe el archivo "./data/setup.done"*/
function first_execution() {
    try {
        fs.readFileSync('./data/setup.done', 'utf-8');
    } catch {
        create_folders_and_files()
    }
}


/** Crea los archivos y carpetas. Al finalizar crea "./data/setup.done" */
function create_folders_and_files() {
    fs.mkdirSync('./data/audioNombres', { recursive: true });
    const start = {};
    const start2 = [];
    fs.writeFileSync('./data/lists.json', JSON.stringify(start));
    fs.writeFileSync('./data/nombresAudio.json', JSON.stringify(start));
    fs.writeFileSync('./data/customPrefix.json', JSON.stringify(start));
    fs.writeFileSync('./data/channels.json', JSON.stringify(start));
    fs.writeFileSync('./data/rss.json', JSON.stringify(start2));
    fs.writeFileSync('./data/freeGames.json', JSON.stringify(start2));
    fs.writeFileSync('./data/setup.done', JSON.stringify(start));
    console.log("First setup done. Files and folders have been created.")
}


module.exports = { first_execution };