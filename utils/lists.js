import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { readFileSync, writeFileSync } from 'fs';
let lists = JSON.parse(readFileSync('./data/lists.json', 'utf-8'));


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
function startList(msg, prefix) {
    if (msg.content.toLowerCase().startsWith(`${prefix}lista`)) {
        let list_title = "Lista de jugadores:";
        if (msg.content.split("lista")[1].length > 0) { list_title = msg.content.split("lista")[1].substring(1) + ":"; }
        let list = new list_class(list_title);
        msg.channel.send(list.title()).then(function (msg2) { lists[msg2.id] = list; });
        writeFileSync('./data/lists.json', JSON.stringify(lists));
    };
};


/** Al clickar el botón del mensaje de la lista, el usuario es añadido o retirado. */
async function addDeleteUser(interaction) {
    if (lists[interaction.message.id] != undefined) {
        if (lists[interaction.message.id].user_ids_and_nicks.hasOwnProperty(interaction.user.id)) {
            interaction.editReply(lists[interaction.message.id].deleteUser(interaction.user.id));
            writeFileSync('./data/lists.json', JSON.stringify(lists));
        } else {
            interaction.editReply(lists[interaction.message.id].addUser(interaction.user.id, interaction.member.displayName))
            writeFileSync('./data/lists.json', JSON.stringify(lists));
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
        let title = this.list_title;
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
        return { embeds: [embed], components: this.createButton() };
    }
}


lists = classify(lists);


export { startList, addDeleteUser };