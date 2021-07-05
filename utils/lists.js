const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
let lists = {};


function startList(msg, prefix) {
    if (msg.content.toLowerCase().startsWith(`${prefix}lista`)) {
        let list = new list_class(msg.author.id, msg.member.displayName);
        msg.channel.send(list.title()).then(function (msg2) { lists[msg2.id] = list; });
    };
};


async function addDeleteUser(interaction) {
    if (lists[interaction.message.id] != undefined) {
        if (lists[interaction.message.id].user_ids_and_nicks.hasOwnProperty(interaction.user.id)) {
            interaction.editReply(lists[interaction.message.id].deleteUser(interaction.user.id));
        } else {
            interaction.editReply(lists[interaction.message.id].addUser(interaction.user.id, interaction.member.displayName))
        }
    }
}


class list_class {
    constructor(user_id, user_nick) {
        this.user_ids_and_nicks = {}; // {"user_id": "displayName"}
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
        let title = "Lista de jugadores:"
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


module.exports = { startList, addDeleteUser };