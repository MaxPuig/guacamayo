import { writeFileSync } from 'fs';


/** Cambia el prefijo con el que se llama al bot. ("." por defecto).
 * Devuelve un objeto con todos los prefijos. */
function changePrefix(msg, prefixes, prefix) {
    if (msg.member.permissions.has("ADMINISTRATOR") && msg.content.toLowerCase().startsWith(prefix + "prefijo")) { // change prefix (only admin)
        let newPrefix = msg.content.split(" ")[1];
        prefixes[msg.guild.id] = newPrefix;
        writeFileSync('./data/customPrefix.json', JSON.stringify(prefixes));
        msg.channel.send("Prefijo Cambiado a " + newPrefix + "\nAhora los comandos se activan así: `" + newPrefix + "help`");
    }
    return prefixes;
}


export { changePrefix };