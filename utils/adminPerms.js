import { setDatabase, getDatabase } from './database.js';


async function addDeleteUserPermission(interaction, addDelete, userId) {
    let datos = await getDatabase('adminPerms');
    if (datos[interaction.guild.id] == undefined) { datos[interaction.guild.id] = [] }
    if (addDelete == 'add') {
        if (datos[interaction.guild.id].includes(userId)) {
            interaction.reply(`<@!${userId}> ya podía usar los comandos.`);
        } else {
            datos[interaction.guild.id].push(userId);
            interaction.reply(`<@!${userId}> podrá usar los comandos.`);
        }
    } else {
        if (datos[interaction.guild.id].includes(userId)) {
            const index = datos[interaction.guild.id].indexOf(userId);
            datos[interaction.guild.id].splice(index, 1);
            interaction.reply(`<@!${userId}> ya no podrá usar los comandos.`);
        } else {
            interaction.reply(`<@!${userId}> no podía usar los comandos.`);
        }
    }
    setDatabase('adminPerms', datos);
}


export { addDeleteUserPermission }