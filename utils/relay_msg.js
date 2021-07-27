import { setDatabase } from './database.js';
import dotenv from 'dotenv';
dotenv.config();


/** Si se ha establecido un canal, reenviará todos los mensajes a ese canal.
 * Devuelve un objeto con todos los canales establecidos. */
function relayMsg(msg, client, channels, prefix) {
    let error_img = ["https://support.discord.com/hc/article_attachments/1500008304041/Screenshot_3.png", "https://support.discord.com/hc/article_attachments/115002742811/mceclip1.png"];
    let error_msg = "Usa `" + prefix + "relay + channelID` para empezar a mandar mensajes a otro servidor.\n";
    error_msg += "(Debe tener permisos: ADMINISTRATOR o MANAGE_CHANNELS)\n";
    error_msg += "Para encontrar el channel ID: <https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID->\n";
    error_msg += "Asegurate de tener el modo desarollador activado(Ajustes>Avanzado>Modo desarollador: ON) y después click derecho sobre el text-channel de destino (`Copy ID`)\n";
    error_msg += "`!!! EL BOT TIENE QUE ESTAR EN AMBOS SERVIDORES !!!`\nInvitación Bot: <" + process.env.INVITELINK + ">";

    if (!msg.author.bot && channels[msg.channel.id] != undefined && !msg.content.toLowerCase().startsWith(prefix)) {
        let attachment = [];
        let guild_id = channels[msg.channel.id];
        let message_send = "**`" + msg.author.username + " (" + msg.member.displayName + "):`** " + msg.content;
        if (msg.attachments.size > 0) { if (msg.attachments.first().size < 8387000) { attachment = [msg.attachments.first().url]; } else { message_send += "\n[File too Big]" } }
        message_send.replace("@", "@ "); // delete mentions
        message_send = message_send.substr(0, 2000);
        let destination = client.channels.cache.get(guild_id);
        if (destination != undefined) {
            destination.send({ content: message_send, files: attachment }).catch();
        } else { msg.channel.send({ content: error_msg, files: error_img }).catch(); }
    }

    if (!msg.author.bot && msg.content.toLowerCase().startsWith(prefix + "relay") && (msg.member.permissions.has("ADMINISTRATOR") || msg.member.permissions.has("MANAGE_CHANNELS"))) {
        if (msg.content.toLowerCase() == prefix + "relay") {
            msg.channel.send({ content: error_msg, files: error_img }).catch();
        } else if (msg.content.includes(" ")) {
            let id = msg.content.toLowerCase().split(" ")[1];
            if (id.toLowerCase() == "stop") {
                delete channels[msg.channel.id];
                setDatabase('channels', channels);
                msg.channel.send({ content: "Canal de envío deshabilitado." }).catch();
            } else if (id.length == 18 && Number.isInteger(parseInt(id))) {
                if (client.channels.cache.get(msg.content.split(" ")[1]) != undefined) {
                    channels[msg.channel.id] = msg.content.split(" ")[1];
                    setDatabase('channels', channels);
                    let name = client.channels.cache.get(msg.content.split(" ")[1]).name;
                    msg.channel.send({ content: "Canal establecido correctamente: " + name }).catch();
                } else { msg.channel.send({ content: error_msg, files: error_img }).catch(); }
            } else { msg.channel.send({ content: error_msg, files: error_img }).catch(); }
        } else {
            msg.channel.send({ content: error_msg, files: error_img }).catch();
        }
    }
    return channels;
}


export { relayMsg };