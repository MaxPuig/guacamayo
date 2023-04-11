import { setDatabase, getDatabase } from "./database.js";

async function addDeleteUserPermission(interaction, addDelete, userId) {
    let datos = await getDatabase("adminPerms");
    if (datos[interaction.guild.id] == undefined) {
        datos[interaction.guild.id] = [];
    }
    if (addDelete == "add") {
        if (datos[interaction.guild.id].includes(userId)) {
            interaction.reply({ content: `<@!${userId}> ya podía usar los comandos.` });
        } else {
            datos[interaction.guild.id].push(userId);
            interaction.reply({ content: `<@!${userId}> podrá usar los comandos.` });
        }
    } else {
        if (datos[interaction.guild.id].includes(userId)) {
            const index = datos[interaction.guild.id].indexOf(userId);
            datos[interaction.guild.id].splice(index, 1);
            interaction.reply({ content: `<@!${userId}> ya no podrá usar los comandos.` });
        } else {
            interaction.reply({ content: `<@!${userId}> no podía usar los comandos.` });
        }
    }
    setDatabase("adminPerms", datos);
}

export { addDeleteUserPermission };
