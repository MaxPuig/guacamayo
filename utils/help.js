import dotenv from 'dotenv';
dotenv.config();
import { MessageEmbed } from 'discord.js';


/** Envía la lista de comandos. */
function sendHelpCommands() {
    const embed = new MessageEmbed()
        .setTitle('**Comandos:**')
        .setColor('#fc0303')
        .addFields(
            { name: '`/invite`', value: 'Envía el link de invitación del Bot.' },
            { name: '`/activity`', value: 'Juega o mira YouTube en un canal de voz.' },
            { name: '`/lista` <Opcional: Nombre de lista>', value: 'Empieza una lista de nombres. Hay que pulsar un botón para unirse.' },
            { name: '`/xgame` <Tamaño>', value: 'Juego. Objetivo: ocultar todas las "x".' },
            { name: '`/rss` [Solo Admin]', value: 'Establece (o quita) ese canal de texto para recibir ofertas de juegos gratis.' },
            { name: '`/voz` [Solo Admin]', value: 'Cambia los ajustes de los avisos de voz.' },
            { name: '`/dar_permisos_bot` [Solo Admin]', value: 'Dar permiso a otro usuario para usar comandos de "Solo Admin".' }
        )
    return { embeds: [embed] };
}


/** Envía el link de invitación del bot. */
function sendInvite() {
    const embed = new MessageEmbed()
        .setTitle('**Añade el bot a tu server**')
        .setURL(process.env.INVITELINK.toString())
        .setColor('#fc0303')
    return { embeds: [embed] };
}


export { sendHelpCommands, sendInvite };