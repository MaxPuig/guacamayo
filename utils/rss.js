import dotenv from 'dotenv';
dotenv.config();
import Parser from 'rss-parser';
let parser = new Parser();
import { getDatabase, setDatabase } from './database.js';
import { MessageActionRow, MessageButton } from 'discord.js';


/** Recolecta las ofertas del feed RSS y las envia por DM con botón de confirmar/cancelar.
 * Las ofertas serán nuevas si no están en la db. */
async function sendRSS(client) {
    let feed = await parser.parseURL('https://steamcommunity.com/groups/GrabFreeGames/rss/');
    let nombres = await getDatabase('freeGames');
    let tempGames = await getDatabase('tempGames');
    Object.keys(tempGames).forEach(val => { nombres.push(tempGames[val].titulo) });
    for (let item of feed.items) {
        if (!nombres.includes(item.title)) {
            nombres.push(item.title); // Por si hay alguna oferta duplicada
            let links = item.content.split('href="');
            links.shift();
            let gameLinks = [];
            for (let link of links) {
                if (link.includes('discord.gg')) break;
                link = link.split('"')[0];
                link = link.replace('https://steamcommunity.com/linkfilter/?url=', '');
                link = link.replace('store.epicgames.com/GRABFREEGAMES/', 'www.epicgames.com/store/es-ES/p/');
                gameLinks.push(link);
            }
            let mensaje = '**Nueva Oferta**\n' + item.title + '\n' + gameLinks.join('\n');
            mensaje = mensaje.substring(0, 2000); // Discord's max message length
            askConfirm(mensaje, item.title, client);
            await sleep(1000); // Para que no se solape la db
        }
    }
}


/** Envía el mensaje con botón de confirmar/cancelar el envio de la oferta. */
async function askConfirm(mensaje, titulo, client) {
    const row = new MessageActionRow()
    row.addComponents(
        new MessageButton()
            .setCustomId('confrim')
            .setLabel('confrim')
            .setStyle('SUCCESS'));
    row.addComponents(
        new MessageButton()
            .setCustomId('cancel')
            .setLabel('cancel')
            .setStyle('DANGER'));
    let sent_message;;
    const admin_id = await client.users.fetch(process.env.BOT_ADMIN);
    await admin_id.send({ content: mensaje, components: [row], fetchReply: true }).then(msg => sent_message = msg);
    const msgid = sent_message.id.toString();
    let tempGames = await getDatabase('tempGames');
    tempGames[msgid] = { mensaje, titulo };
    setDatabase('tempGames', tempGames);
    await sleep(1000 * 60 * Number(process.env.MINUTES_BEFORE_AUTOSEND_FREE_GAME)); // 10 minutos antes de que se envie el mensaje automáticamente
    let tempGames2 = await getDatabase('tempGames');
    if (tempGames2[msgid]) {
        sent_message.edit({ content: tempGames2[msgid].titulo + '\n**Oferta Enviada Automáticamente**', components: [] });
        let rssChannels = await getDatabase('rss');
        for (const channel of rssChannels) {
            try { client.channels.cache.get(channel).send(tempGames2[msgid].mensaje); } catch (error) { console.log(error); }
        }
        let nombres = await getDatabase('freeGames');
        nombres.push(tempGames2[msgid].titulo);
        setDatabase('freeGames', nombres);
        delete tempGames2[msgid];
        setDatabase('tempGames', tempGames2);
    }
}


/** Si se ha pulsado el botón de confirmar, se envía la oferta. Si se pulsa cancelar, no. */
async function confirmGame(interaction, client) {
    let tempGames = await getDatabase('tempGames');
    if (!tempGames[interaction.message.id]) return;
    if (interaction.customId == 'confrim') {
        let rssChannels = await getDatabase('rss');
        for (const channel of rssChannels) {
            try { client.channels.cache.get(channel).send({ content: tempGames[interaction.message.id].mensaje }); } catch (error) { console.log(error); }
        }
        interaction.editReply({ content: tempGames[interaction.message.id].titulo + '\n**Oferta Confirmada**', components: [] });
    } else {
        interaction.editReply({ content: tempGames[interaction.message.id].titulo + '\n**Oferta Cancelada**', components: [] });
    }
    let nombres = await getDatabase('freeGames');
    nombres.push(tempGames[interaction.message.id].titulo);
    setDatabase('freeGames', nombres);
    delete tempGames[interaction.message.id];
    setDatabase('tempGames', tempGames);
}


/** Espera x ms a seguir. */
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }


/** Establece o elimina el canal donde tiene que enviar los mensajes y lo guarda en la db. */
async function setRSSchannel(interaction, activo) {
    if (activo == 'establecer') {
        let rssChannels = await getDatabase('rss');
        if (rssChannels.indexOf(interaction.channel.id) !== -1) {
            await interaction.reply('El canal ya estaba establecido.\n`/ofertas quitar` para dejar de recibir las ofertas.');
        } else {
            rssChannels.push(interaction.channel.id)
            setDatabase('rss', rssChannels);
            await interaction.reply('Canal establecido.\n`/ofertas quitar` para dejar de recibir las ofertas.');
        }
    } else {
        let rssChannels = await getDatabase('rss');
        const index = rssChannels.indexOf(interaction.channel.id);
        if (index > -1) {
            rssChannels.splice(index, 1);
            setDatabase('rss', rssChannels);
            await interaction.reply('Este canal ya no recibirá ofertas.\n`/ofertas establecer` para volver a recibirlas.');
        } else {
            await interaction.reply('El canal NO recibía ofertas.\n`/ofertas establecer` para recibirlas.');
        }
    }
};


export { sendRSS, setRSSchannel, confirmGame };