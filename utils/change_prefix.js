const fs = require('fs');

function changePrefix(msg, prefixes) {
    if (msg.member.permissions.has("ADMINISTRATOR") && msg.content.toLowerCase().startsWith(prefix + "prefijo")) { // change prefix (only admin)
        let newPrefix = msg.content.split(" ")[1];
        prefixes[msg.guild.id] = newPrefix;
        fs.writeFileSync('./data/customPrefix.json', JSON.stringify(prefixes));
        msg.channel.send("Prefijo Cambiado a " + newPrefix + "\nAhora los comandos se activan así: `" + newPrefix + "help`");
    }
    return prefixes;
}

module.exports = { changePrefix };