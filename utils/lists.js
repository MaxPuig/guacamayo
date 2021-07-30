import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { getDatabase, setDatabase } from './database.js';
let lists = await getDatabase('lists');


/** Convierte la lista guardada en clases. Ejecutada al final del script. */
function classify(lists) {
    let newLists_classified = {};
    for (const [key, value] of Object.entries(lists)) {
        newLists_classified[key] = new list_class(value.list_title);
        newLists_classified[key].user_ids_and_nicks = value.user_ids_and_nicks;
    }
    return newLists_classified;
}


/** Crea una nueva lista y la envía. Admite título de lista personalizado.*/
async function startList(interaction, list_title) {
    if (!list_title) list_title = "Lista de jugadores";
    let list = new list_class(list_title);
    await interaction.reply(list.title()).then(function (msg2) { lists[msg2.id] = list; });
    await setDatabase('lists', lists);
};


/** Al clickar el botón del mensaje de la lista, el usuario es añadido o retirado. */
async function addDeleteUser(interaction) {
    if (lists[interaction.message.id] != undefined) {
        if (lists[interaction.message.id].user_ids_and_nicks.hasOwnProperty(interaction.user.id)) {
            await interaction.editReply(lists[interaction.message.id].deleteUser(interaction.user.id));
            await setDatabase('lists', lists);
        } else {
            await interaction.editReply(lists[interaction.message.id].addUser(interaction.user.id, interaction.member.displayName))
            await setDatabase('lists', lists);
        }
    }
}


class list_class {
    constructor(list_title) {
        this.user_ids_and_nicks = {}; // {"user_id": "displayName"}
        this.list_title = list_title;
    }
    addUser(user_id, user_nick) {
        this.user_ids_and_nicks[user_id] = user_nick;
        return this.title();
    }
    deleteUser(user_id) {
        delete this.user_ids_and_nicks[user_id];
        return this.title();
    }
    createButton() {
        const row = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId("Join")
                .setLabel("Unirse/Salirse")
                .setStyle('SECONDARY'));
        return [row]
    }
    title() {
        let title = this.list_title + ':';
        let message = "nadie";
        let i = 0;
        for (const [key, value] of Object.entries(this.user_ids_and_nicks)) {
            if (message == "nadie") {
                message = "";
            }
            i++;
            message += `${i}. ${value}\n`
        }
        let embed = new MessageEmbed()
            .setTitle(title)
        if (message.length > 0) {
            embed.setDescription(message);
        }
        return { embeds: [embed], components: this.createButton(), fetchReply: true };
    }
}


lists = classify(lists);


export { startList, addDeleteUser };